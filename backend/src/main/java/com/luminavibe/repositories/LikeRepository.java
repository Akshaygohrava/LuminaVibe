package com.luminavibe.repositories;

import com.luminavibe.entities.Like;
import com.luminavibe.entities.TargetType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface LikeRepository extends JpaRepository<Like, Integer> {
    Optional<Like> findByUserUserIdAndTargetTypeAndTargetId(Integer userId, TargetType targetType, Integer targetId);
    int countByTargetTypeAndTargetId(TargetType targetType, Integer targetId);
    boolean existsByUserUserIdAndTargetTypeAndTargetId(Integer userId, TargetType targetType, Integer targetId);
}
