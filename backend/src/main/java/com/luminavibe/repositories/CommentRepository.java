package com.luminavibe.repositories;

import com.luminavibe.entities.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Integer> {
    List<Comment> findByPostPostIdAndParentCommentIsNullOrderByCreatedAtAsc(Integer postId);
    List<Comment> findByParentCommentCommentIdOrderByCreatedAtAsc(Integer parentCommentId);
    List<Comment> findByPostPostIdOrderByCreatedAtAsc(Integer postId);
}
