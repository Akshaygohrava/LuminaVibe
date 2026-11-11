package com.luminavibe.services.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.luminavibe.dtos.StoredFile;
import com.luminavibe.entities.MediaFile;
import com.luminavibe.repositories.MediaFileRepository;
import com.luminavibe.services.BaseUrlService;
import com.luminavibe.services.FileStorageService;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.IIOImage;
import javax.imageio.ImageIO;
import javax.imageio.ImageWriteParam;
import javax.imageio.ImageWriter;
import javax.imageio.stream.ImageOutputStream;
import java.awt.Graphics2D;
import java.awt.RenderingHints;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.Iterator;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
public class FileStorageServiceImpl implements FileStorageService {

    private static final Logger logger = LoggerFactory.getLogger(FileStorageServiceImpl.class);

    @Autowired
    private MediaFileRepository mediaFileRepository;

    @Autowired
    private BaseUrlService baseUrlService;

    @Autowired(required = false)
    private org.springframework.jdbc.core.JdbcTemplate jdbcTemplate;

    @Value("${cloudinary.url:}")
    private String cloudinaryUrlConfig;

    private Cloudinary cloudinary;

    @PostConstruct
    public void init() {
        System.setProperty("java.awt.headless", "true");

        String cloudUrl = System.getenv("CLOUDINARY_URL");
        if (cloudUrl == null || cloudUrl.trim().isEmpty()) {
            cloudUrl = cloudinaryUrlConfig;
        }

        if (cloudUrl != null && !cloudUrl.trim().isEmpty()) {
            try {
                this.cloudinary = new Cloudinary(cloudUrl);
                logger.info("Cloudinary storage provider initialized successfully.");
            } catch (Exception e) {
                logger.warn("Failed to initialize Cloudinary with provided URL. Falling back to persistent database storage: {}", e.getMessage());
                this.cloudinary = null;
            }
        } else {
            logger.info("No CLOUDINARY_URL configured. Using persistent PostgreSQL database + local disk cache storage.");
        }

        // Ensure local uploads directories exist
        try {
            new File("uploads").mkdirs();
            new File("uploads/posts").mkdirs();
            new File("uploads/stories").mkdirs();
        } catch (Exception ignored) {}

        // Ensure media_files table exists in PostgreSQL
        if (jdbcTemplate != null) {
            try {
                jdbcTemplate.execute(
                    "CREATE TABLE IF NOT EXISTS media_files (" +
                    "file_id BIGSERIAL PRIMARY KEY, " +
                    "file_path VARCHAR(255) UNIQUE NOT NULL, " +
                    "content_type VARCHAR(100) NOT NULL, " +
                    "file_size BIGINT, " +
                    "data BYTEA, " +
                    "created_at TIMESTAMP NOT NULL DEFAULT NOW())"
                );
            } catch (Exception e) {
                logger.warn("Could not ensure media_files table exists via JDBC: {}", e.getMessage());
            }
        }
    }

    @Override
    public String storeFile(MultipartFile file, String subfolder) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Cannot store an empty file");
        }

        // 1. If Cloudinary is configured, upload to Cloudinary CDN
        if (this.cloudinary != null) {
            try {
                String folderName = "luminavibe" + (subfolder == null || subfolder.trim().isEmpty() ? "" : "/" + subfolder.trim());
                Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
                        "resource_type", "auto",
                        "folder", folderName
                ));
                String secureUrl = (String) uploadResult.get("secure_url");
                if (secureUrl != null && !secureUrl.isEmpty()) {
                    return secureUrl;
                }
            } catch (Exception e) {
                logger.error("Cloudinary upload failed, falling back to persistent DB storage: {}", e.getMessage());
            }
        }

        // 2. Persistent Database + Disk Cache Storage
        String originalName = file.getOriginalFilename();
        String extension = "";
        if (originalName != null && originalName.contains(".")) {
            extension = originalName.substring(originalName.lastIndexOf("."));
        }
        if (extension.isEmpty()) {
            extension = ".jpg";
        }

        String newFileName = UUID.randomUUID().toString() + extension;
        String cleanSubfolder = (subfolder == null) ? "" : subfolder.trim().replace("\\", "/").replaceAll("^/+|/+$", "");
        String relativePath = cleanSubfolder.isEmpty() ? newFileName : cleanSubfolder + "/" + newFileName;

        String contentType = file.getContentType();
        if (contentType == null || contentType.isEmpty()) {
            contentType = determineContentType(newFileName);
        }

        byte[] fileBytes = file.getBytes();

        // Optimize image if it's a JPEG or PNG to reduce DB payload and speed up loading
        if (contentType.startsWith("image/") && !contentType.contains("gif") && !contentType.contains("svg") && fileBytes.length > 200 * 1024) {
            byte[] optimized = optimizeImage(fileBytes, contentType);
            if (optimized != null && optimized.length < fileBytes.length) {
                fileBytes = optimized;
            }
        }

        // Save to local disk cache
        try {
            File diskDir = new File("uploads" + (cleanSubfolder.isEmpty() ? "" : File.separator + cleanSubfolder));
            if (!diskDir.exists()) {
                diskDir.mkdirs();
            }
            File diskFile = new File(diskDir, newFileName);
            Files.write(diskFile.toPath(), fileBytes);
        } catch (Exception e) {
            logger.warn("Could not write to local disk cache: {}", e.getMessage());
        }

        // Save to PostgreSQL persistent media_files table (with resilient fallback)
        try {
            MediaFile mediaFile = new MediaFile();
            mediaFile.setFilePath(relativePath);
            mediaFile.setContentType(contentType);
            mediaFile.setFileSize((long) fileBytes.length);
            mediaFile.setData(fileBytes);
            mediaFileRepository.save(mediaFile);
        } catch (Exception e) {
            logger.warn("JPA mediaFileRepository.save failed for {}, trying direct JDBC fallback: {}", relativePath, e.getMessage());
            if (jdbcTemplate != null) {
                try {
                    jdbcTemplate.update(
                        "INSERT INTO media_files (file_path, content_type, file_size, data, created_at) " +
                        "VALUES (?, ?, ?, ?, NOW()) ON CONFLICT (file_path) DO UPDATE SET data = EXCLUDED.data, content_type = EXCLUDED.content_type, file_size = EXCLUDED.file_size",
                        relativePath, contentType, (long) fileBytes.length, fileBytes
                    );
                } catch (Exception ex) {
                    logger.error("Could not persist media file to database: {}", ex.getMessage());
                }
            }
        }

        return baseUrlService.getBaseUrl() + "/uploads/" + relativePath;
    }

    @Override
    @Transactional(readOnly = true)
    public StoredFile getFile(String filePath) {
        if (filePath == null || filePath.trim().isEmpty()) {
            return null;
        }

        String cleanPath = filePath.trim().replace("\\", "/").replaceAll("^/+", "");
        if (cleanPath.startsWith("uploads/")) {
            cleanPath = cleanPath.substring("uploads/".length());
        }

        // 1. Check local disk cache first (instant response)
        File diskFile = new File("uploads", cleanPath);
        if (diskFile.exists() && diskFile.isFile()) {
            try {
                byte[] bytes = Files.readAllBytes(diskFile.toPath());
                String contentType = Files.probeContentType(diskFile.toPath());
                if (contentType == null) {
                    contentType = determineContentType(diskFile.getName());
                }
                return new StoredFile(diskFile.getName(), contentType, bytes);
            } catch (Exception e) {
                logger.warn("Error reading local disk cache for {}: {}", cleanPath, e.getMessage());
            }
        }

        // 2. If missing from disk cache (Render restarted/wiped the container), restore from persistent PostgreSQL database!
        try {
            Optional<MediaFile> opt = mediaFileRepository.findByFilePath(cleanPath);
            if (opt.isEmpty()) {
                opt = mediaFileRepository.findByFilePath("uploads/" + cleanPath);
            }
            if (opt.isPresent()) {
                MediaFile mf = opt.get();

                // Re-cache to local disk so subsequent requests are fast
                try {
                    if (diskFile.getParentFile() != null && !diskFile.getParentFile().exists()) {
                        diskFile.getParentFile().mkdirs();
                    }
                    Files.write(diskFile.toPath(), mf.getData());
                } catch (Exception e) {
                    logger.warn("Could not re-cache restored file to disk: {}", e.getMessage());
                }

                return new StoredFile(cleanPath, mf.getContentType(), mf.getData());
            }
        } catch (Exception e) {
            logger.warn("JPA lookup failed for {}, attempting direct JDBC lookup: {}", cleanPath, e.getMessage());
        }

        // Direct JDBC fallback lookup
        if (jdbcTemplate != null) {
            try {
                java.util.List<StoredFile> results = jdbcTemplate.query(
                    "SELECT file_path, content_type, data FROM media_files WHERE file_path = ? OR file_path = ? LIMIT 1",
                    (rs, rowNum) -> new StoredFile(rs.getString("file_path"), rs.getString("content_type"), rs.getBytes("data")),
                    cleanPath, "uploads/" + cleanPath
                );
                if (!results.isEmpty()) {
                    StoredFile sf = results.get(0);
                    try {
                        if (diskFile.getParentFile() != null && !diskFile.getParentFile().exists()) {
                            diskFile.getParentFile().mkdirs();
                        }
                        Files.write(diskFile.toPath(), sf.getData());
                    } catch (Exception ignored) {}
                    return sf;
                }
            } catch (Exception ex) {
                logger.warn("Direct JDBC lookup failed for {}: {}", cleanPath, ex.getMessage());
            }
        }

        return null;
    }

    @Override
    @Transactional
    public void deleteFile(String fileUrlOrPath) {
        if (fileUrlOrPath == null || fileUrlOrPath.trim().isEmpty()) {
            return;
        }

        String cleanPath = fileUrlOrPath.trim();
        if (cleanPath.contains("/uploads/")) {
            cleanPath = cleanPath.substring(cleanPath.indexOf("/uploads/") + 9);
        }
        cleanPath = cleanPath.replace("\\", "/").replaceAll("^/+", "");
        if (cleanPath.startsWith("uploads/")) {
            cleanPath = cleanPath.substring("uploads/".length());
        }

        try {
            mediaFileRepository.deleteByFilePath(cleanPath);
            mediaFileRepository.deleteByFilePath("uploads/" + cleanPath);
        } catch (Exception e) {
            logger.warn("Could not delete media file record {}: {}", cleanPath, e.getMessage());
        }

        if (jdbcTemplate != null) {
            try {
                jdbcTemplate.update("DELETE FROM media_files WHERE file_path = ? OR file_path = ?", cleanPath, "uploads/" + cleanPath);
            } catch (Exception ignored) {}
        }

        try {
            File diskFile = new File("uploads", cleanPath);
            if (diskFile.exists()) {
                diskFile.delete();
            }
        } catch (Exception ignored) {}
    }

    private String determineContentType(String filename) {
        String lower = filename.toLowerCase();
        if (lower.endsWith(".png")) return "image/png";
        if (lower.endsWith(".gif")) return "image/gif";
        if (lower.endsWith(".webp")) return "image/webp";
        if (lower.endsWith(".svg")) return "image/svg+xml";
        if (lower.endsWith(".mp4")) return "video/mp4";
        if (lower.endsWith(".webm")) return "video/webm";
        if (lower.endsWith(".mov")) return "video/quicktime";
        return "image/jpeg";
    }

    private byte[] optimizeImage(byte[] originalBytes, String contentType) {
        try {
            BufferedImage image = ImageIO.read(new ByteArrayInputStream(originalBytes));
            if (image == null) return null;

            int maxDim = 1600;
            int width = image.getWidth();
            int height = image.getHeight();

            boolean needsResize = (width > maxDim || height > maxDim);
            if (needsResize) {
                double scale = Math.min((double) maxDim / width, (double) maxDim / height);
                int targetW = (int) (width * scale);
                int targetH = (int) (height * scale);

                BufferedImage resized = new BufferedImage(targetW, targetH, BufferedImage.TYPE_INT_RGB);
                Graphics2D g = resized.createGraphics();
                g.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BILINEAR);
                g.setRenderingHint(RenderingHints.KEY_RENDERING, RenderingHints.VALUE_RENDER_QUALITY);
                g.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
                g.drawImage(image, 0, 0, targetW, targetH, null);
                g.dispose();
                image = resized;
            }

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            Iterator<ImageWriter> writers = ImageIO.getImageWritersByFormatName("jpeg");
            if (!writers.hasNext()) return null;

            ImageWriter writer = writers.next();
            ImageWriteParam param = writer.getDefaultWriteParam();
            if (param.canWriteCompressed()) {
                param.setCompressionMode(ImageWriteParam.MODE_EXPLICIT);
                param.setCompressionQuality(0.85f);
            }

            try (ImageOutputStream ios = ImageIO.createImageOutputStream(baos)) {
                writer.setOutput(ios);
                writer.write(null, new IIOImage(image, null, null), param);
                writer.dispose();
            }

            return baos.toByteArray();
        } catch (Throwable t) {
            return null; // fallback to original
        }
    }
}
