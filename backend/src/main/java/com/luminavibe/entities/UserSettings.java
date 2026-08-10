package com.luminavibe.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "user_settings")
public class UserSettings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "settings_id")
    private Integer settingsId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "dark_mode", nullable = false)
    private Boolean darkMode = true;

    @Column(name = "notifications_enabled", nullable = false)
    private Boolean notificationsEnabled = true;

    @Column(name = "language", length = 10, nullable = false)
    private String language = "en";
}
