package com.luminavibe.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.io.File;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    // Note: /uploads/** is now managed by MediaController to provide
    // persistent database-backed storage and disk caching across Render restarts.
}
