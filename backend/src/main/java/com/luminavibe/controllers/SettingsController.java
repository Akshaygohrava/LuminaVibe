package com.luminavibe.controllers;

import com.luminavibe.dtos.UserSettingsDto;
import com.luminavibe.services.SettingsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/settings")
@CrossOrigin
public class SettingsController {

    @Autowired
    private SettingsService settingsService;

    @GetMapping("/{userId}")
    public ResponseEntity<UserSettingsDto> getSettings(@PathVariable("userId") Integer userId) {
        return ResponseEntity.ok(settingsService.getSettings(userId));
    }

    @PutMapping("/{userId}")
    public ResponseEntity<UserSettingsDto> updateSettings(
            @PathVariable("userId") Integer userId,
            @RequestBody UserSettingsDto settingsDto) {
        return ResponseEntity.ok(settingsService.updateSettings(userId, settingsDto));
    }
}
