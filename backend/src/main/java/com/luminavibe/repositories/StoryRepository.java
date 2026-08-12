package com.luminavibe.repositories;

import com.luminavibe.entities.Story;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface StoryRepository extends JpaRepository<Story, Integer> {
    List<Story> findByUserUserIdInAndExpiresAtAfterOrderByCreatedAtAsc(List<Integer> userIds, LocalDateTime time);
    List<Story> findByUserUserIdAndExpiresAtAfterOrderByCreatedAtAsc(Integer userId, LocalDateTime time);
}
