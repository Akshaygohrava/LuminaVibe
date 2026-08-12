package com.luminavibe.services;

import com.luminavibe.dtos.CommentDto;
import java.util.List;

public interface CommentService {
    CommentDto addComment(Integer userId, Integer postId, Integer parentCommentId, String content);
    List<CommentDto> getCommentsForPost(Integer postId);
}
