package com.luminavibe.controllers;

import com.luminavibe.dtos.StoredFile;
import com.luminavibe.services.FileStorageService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.HandlerMapping;

@RestController
@RequestMapping("/uploads")
@CrossOrigin
public class MediaController {

    @Autowired
    private FileStorageService fileStorageService;

    @GetMapping("/{filename:.+}")
    public ResponseEntity<byte[]> getRootFile(@PathVariable("filename") String filename) {
        return serveFile(filename);
    }

    @GetMapping("/{folder}/{filename:.+}")
    public ResponseEntity<byte[]> getFolderFile(
            @PathVariable("folder") String folder,
            @PathVariable("filename") String filename) {
        return serveFile(folder + "/" + filename);
    }

    @GetMapping("/**")
    public ResponseEntity<byte[]> getFallbackFile(HttpServletRequest request) {
        String path = (String) request.getAttribute(HandlerMapping.PATH_WITHIN_HANDLER_MAPPING_ATTRIBUTE);
        if (path == null) {
            return ResponseEntity.notFound().build();
        }
        if (path.startsWith("/uploads/")) {
            path = path.substring("/uploads/".length());
        }
        return serveFile(path);
    }

    private ResponseEntity<byte[]> serveFile(String filePath) {
        StoredFile stored = fileStorageService.getFile(filePath);
        if (stored == null || stored.getData() == null) {
            return ResponseEntity.notFound().build();
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
}
