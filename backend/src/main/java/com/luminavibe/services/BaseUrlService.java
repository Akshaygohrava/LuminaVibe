package com.luminavibe.services;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@Service
public class BaseUrlService {

    @Value("${app.base-url:https://luminavibe-backend.onrender.com}")
    private String appBaseUrl;

    @Autowired(required = false)
    private JdbcTemplate jdbcTemplate;

    public String getBaseUrl() {
        if (appBaseUrl != null && !appBaseUrl.trim().isEmpty()) {
            return appBaseUrl.replaceAll("/+$", "");
        }
        try {
            return ServletUriComponentsBuilder.fromCurrentContextPath().toUriString().replaceAll("/+$", "");
        } catch (Exception e) {
            return "https://luminavibe-backend.onrender.com";
        }
    }

    public String fixUrl(String url) {
        if (url == null || url.trim().isEmpty()) {
            return url;
        }
        String base = getBaseUrl();
        if (url.contains("localhost:8080")) {
            return url.replaceAll("https?://localhost:8080", base);
        }
        if (url.startsWith("/uploads/") || url.startsWith("uploads/")) {
            String path = url.startsWith("/") ? url : "/" + url;
            return base + path;
        }
        return url;
    }

    @PostConstruct
    public void migrateLegacyLocalhostUrls() {
        if (jdbcTemplate == null) return;
        try {
            String base = getBaseUrl();
            // Automatically migrate any legacy localhost:8080 URLs in database to the live backend URL
            jdbcTemplate.update("UPDATE users SET profile_picture_url = REPLACE(profile_picture_url, 'http://localhost:8080', ?) WHERE profile_picture_url LIKE '%localhost:8080%'", base);
            jdbcTemplate.update("UPDATE users SET profile_picture_url = REPLACE(profile_picture_url, 'https://localhost:8080', ?) WHERE profile_picture_url LIKE '%localhost:8080%'", base);

            jdbcTemplate.update("UPDATE post_media SET media_url = REPLACE(media_url, 'http://localhost:8080', ?) WHERE media_url LIKE '%localhost:8080%'", base);
            jdbcTemplate.update("UPDATE post_media SET media_url = REPLACE(media_url, 'https://localhost:8080', ?) WHERE media_url LIKE '%localhost:8080%'", base);

            jdbcTemplate.update("UPDATE story_media SET media_url = REPLACE(media_url, 'http://localhost:8080', ?) WHERE media_url LIKE '%localhost:8080%'", base);
            jdbcTemplate.update("UPDATE story_media SET media_url = REPLACE(media_url, 'https://localhost:8080', ?) WHERE media_url LIKE '%localhost:8080%'", base);
        } catch (Exception ignored) {
            // Table might not be ready or empty on initial boot
        }
    }
}

