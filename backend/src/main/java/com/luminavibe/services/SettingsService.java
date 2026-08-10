package com.luminavibe.services;

import com.luminavibe.dtos.UserSettingsDto;

public interface SettingsService {
    UserSettingsDto getSettings(Integer userId);
    UserSettingsDto updateSettings(Integer userId, UserSettingsDto settingsDto);
}
