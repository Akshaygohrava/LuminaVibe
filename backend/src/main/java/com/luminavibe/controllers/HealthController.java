package com.luminavibe.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.Map;

@RestController
@CrossOrigin
public class HealthController {

    @GetMapping({"/health", "/api/health"})
    public ResponseEntity<Map<String, Object>> checkHealth() {
        return ResponseEntity.ok(Map.of(
            "status", "UP",
            "service", "LuminaVibe Backend",
            "timestamp", Instant.now().toString()
        ));
    }
}

