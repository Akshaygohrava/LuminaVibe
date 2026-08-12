package com.luminavibe.repositories;

import com.luminavibe.entities.Bookmark;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookmarkRepository extends JpaRepository<Bookmark, Integer> {
    Optional<Bookmark> findByUserUserIdAndPostPostId(Integer userId, Integer postId);
    List<Bookmark> findByUserUserIdOrderByCreatedAtDesc(Integer userId);
    boolean existsByUserUserIdAndPostPostId(Integer userId, Integer postId);
    void deleteByUserUserIdAndPostPostId(Integer userId, Integer postId);
}
