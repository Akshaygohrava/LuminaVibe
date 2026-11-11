package com.luminavibe.controllers;

import com.luminavibe.dtos.StoredFile;
import com.luminavibe.services.FileStorageService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.HandlerMapping;

@RestController
@RequestMapping("/uploads")
@CrossOrigin
public class MediaController {

    private static final String[] DUMMY_POST_IMAGES = new String[] {
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop"
    };

    private static final String[] DUMMY_AVATARS = new String[] {
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop"
    };

    @Autowired
    private FileStorageService fileStorageService;

    @GetMapping("/{filename:.+}")
    public ResponseEntity<?> getRootFile(@PathVariable("filename") String filename) {
        return serveFile(filename);
    }

    @GetMapping("/{folder}/{filename:.+}")
    public ResponseEntity<?> getFolderFile(
            @PathVariable("folder") String folder,
            @PathVariable("filename") String filename) {
        return serveFile(folder + "/" + filename);
    }

    @GetMapping("/**")
    public ResponseEntity<?> getFallbackFile(HttpServletRequest request) {
        String path = (String) request.getAttribute(HandlerMapping.PATH_WITHIN_HANDLER_MAPPING_ATTRIBUTE);
        if (path == null) {
            return redirectToDummy("");
        }
        if (path.startsWith("/uploads/")) {
            path = path.substring("/uploads/".length());
        }
        return serveFile(path);
    }

    private ResponseEntity<?> serveFile(String filePath) {
        StoredFile stored = fileStorageService.getFile(filePath);
        if (stored == null || stored.getData() == null || stored.getData().length == 0) {
            // Missing file (e.g. old post wiped from Render ephemeral disk before persistent storage)
            // Redirect to a high-quality dummy aesthetic image so user never sees 404 or broken alt text!
            return redirectToDummy(filePath);
        }

        MediaType mediaType;
        try {
            mediaType = MediaType.parseMediaType(stored.getContentType());
        } catch (Exception e) {
            mediaType = MediaType.APPLICATION_OCTET_STREAM;
        }

        return ResponseEntity.ok()
                .contentType(mediaType)
                .header(HttpHeaders.CACHE_CONTROL, "public, max-age=604800, immutable")
                .body(stored.getData());
    }

    private ResponseEntity<?> redirectToDummy(String filePath) {
        String dummyUrl = getDummyImageUrl(filePath);
        return ResponseEntity.status(HttpStatus.FOUND)
                .header(HttpHeaders.LOCATION, dummyUrl)
                .header(HttpHeaders.CACHE_CONTROL, "public, max-age=86400")
                .build();
    }

    private String getDummyImageUrl(String filePath) {
        if (filePath == null || filePath.trim().isEmpty()) {
            return DUMMY_POST_IMAGES[0];
        }
        String lower = filePath.toLowerCase();
        int hash = Math.abs(filePath.hashCode());
        if (lower.contains("avatar") || !filePath.contains("/")) {
            return DUMMY_AVATARS[hash % DUMMY_AVATARS.length];
        }
        return DUMMY_POST_IMAGES[hash % DUMMY_POST_IMAGES.length];
    }
}
