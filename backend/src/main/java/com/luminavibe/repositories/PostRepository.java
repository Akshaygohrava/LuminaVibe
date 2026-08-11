package com.luminavibe.repositories;

import com.luminavibe.entities.Post;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PostRepository extends JpaRepository<Post, Integer> {
    List<Post> findAllByOrderByCreatedAtDesc();
    List<Post> findByUserUserIdOrderByCreatedAtDesc(Integer userId);
}
