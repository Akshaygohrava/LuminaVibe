package com.luminavibe.repositories;

import com.luminavibe.entities.Follow;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FollowRepository extends JpaRepository<Follow, Integer> {
    Optional<Follow> findByFollowerUserIdAndFollowingUserId(Integer followerId, Integer followingId);
    List<Follow> findByFollowingUserIdAndStatus(Integer followingId, String status);
    List<Follow> findByFollowerUserIdAndStatus(Integer followerId, String status);
    long countByFollowingUserIdAndStatus(Integer followingId, String status);
    long countByFollowerUserIdAndStatus(Integer followerId, String status);
    boolean existsByFollowerUserIdAndFollowingUserIdAndStatus(Integer followerId, Integer followingId, String status);
}
