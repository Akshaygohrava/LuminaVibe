package com.luminavibe.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserSettingsDto {

    @JsonProperty("is_private")
    private Boolean isPrivate;

    @JsonProperty("dark_mode")
    private Boolean darkMode;

    @JsonProperty("notifications_enabled")
    private Boolean notificationsEnabled;

    private String language;
}
