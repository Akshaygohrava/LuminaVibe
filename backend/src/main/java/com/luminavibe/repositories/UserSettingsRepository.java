package com.luminavibe.repositories;

import com.luminavibe.entities.UserSettings;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserSettingsRepository extends JpaRepository<UserSettings, Integer> {
    Optional<UserSettings> findByUserUserId(Integer userId);
}
