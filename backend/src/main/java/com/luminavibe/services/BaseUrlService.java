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

            // Populate fallback dummy images for any legacy posts/stories/users with missing media
            jdbcTemplate.update("UPDATE post_media SET media_url = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop' WHERE media_url IS NULL OR TRIM(media_url) = ''");
            jdbcTemplate.update("UPDATE story_media SET media_url = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop' WHERE media_url IS NULL OR TRIM(media_url) = ''");
            jdbcTemplate.update("UPDATE users SET profile_picture_url = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop' WHERE profile_picture_url IS NULL OR TRIM(profile_picture_url) = ''");

            // Attach fallback dummy media to any legacy posts that have no post_media rows
            jdbcTemplate.update("INSERT INTO post_media (post_id, media_url, media_type) " +
                    "SELECT post_id, 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop', 'image/jpeg' " +
                    "FROM posts WHERE post_id NOT IN (SELECT DISTINCT post_id FROM post_media WHERE post_id IS NOT NULL)");
        } catch (Exception ignored) {
            // Table might not be ready or empty on initial boot
        }
    }
}

