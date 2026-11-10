package com.luminavibe.services;

import com.luminavibe.dtos.StoredFile;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface FileStorageService {
    /**
     * Stores a file into persistent storage (Cloudinary if configured, or PostgreSQL + disk cache)
     * @param file The multipart file uploaded
     * @param subfolder The subfolder, e.g. "posts", "stories", or "" for avatars
     * @return Full accessible URL to the file
     */
    String storeFile(MultipartFile file, String subfolder) throws IOException;

    /**
     * Retrieves a stored file by its relative path (e.g. "posts/abc.jpg" or "abc.jpg")
     * Checks local disk cache first, then falls back to PostgreSQL if the container restarted.
     */
    StoredFile getFile(String filePath);

    /**
     * Deletes a file from persistent storage and disk cache
     */
    void deleteFile(String fileUrlOrPath);
}

