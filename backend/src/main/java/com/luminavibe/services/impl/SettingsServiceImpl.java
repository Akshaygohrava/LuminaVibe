package com.luminavibe.services.impl;

import com.luminavibe.dtos.UserSettingsDto;
import com.luminavibe.entities.User;
import com.luminavibe.entities.UserSettings;
import com.luminavibe.repositories.UserRepository;
import com.luminavibe.repositories.UserSettingsRepository;
import com.luminavibe.services.SettingsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

@Service
public class SettingsServiceImpl implements SettingsService {

    @Autowired
    private UserSettingsRepository userSettingsRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserSettingsDto getSettings(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        UserSettings settings = userSettingsRepository.findByUserUserId(userId)
                .orElseGet(() -> {
                    UserSettings s = new UserSettings();
                    s.setUser(user);
                    s.setDarkMode(true);
                    s.setNotificationsEnabled(true);
                    s.setLanguage("en");
                    return userSettingsRepository.save(s);
                });

        return new UserSettingsDto(user.getIsPrivate(), settings.getDarkMode(), settings.getNotificationsEnabled(), settings.getLanguage());
    }

    @Override
    public UserSettingsDto updateSettings(Integer userId, UserSettingsDto settingsDto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        UserSettings settings = userSettingsRepository.findByUserUserId(userId)
                .orElseGet(() -> {
                    UserSettings s = new UserSettings();
                    s.setUser(user);
                    return s;
                });

        if (settingsDto.getIsPrivate() != null) {
            user.setIsPrivate(settingsDto.getIsPrivate());
            userRepository.save(user);
        }
        if (settingsDto.getDarkMode() != null) {
            settings.setDarkMode(settingsDto.getDarkMode());
        }
        if (settingsDto.getNotificationsEnabled() != null) {
            settings.setNotificationsEnabled(settingsDto.getNotificationsEnabled());
        }
        if (settingsDto.getLanguage() != null) {
            settings.setLanguage(settingsDto.getLanguage());
        }

        userSettingsRepository.save(settings);

        return new UserSettingsDto(user.getIsPrivate(), settings.getDarkMode(), settings.getNotificationsEnabled(), settings.getLanguage());
    }
}
