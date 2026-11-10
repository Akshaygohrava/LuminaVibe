package com.luminavibe.repositories;

import com.luminavibe.entities.MediaFile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MediaFileRepository extends JpaRepository<MediaFile, Long> {
    Optional<MediaFile> findByFilePath(String filePath);
    void deleteByFilePath(String filePath);
    boolean existsByFilePath(String filePath);
}

