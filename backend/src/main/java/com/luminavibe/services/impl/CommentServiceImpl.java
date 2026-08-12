package com.luminavibe.services.impl;

import com.luminavibe.dtos.CommentDto;
import com.luminavibe.entities.Comment;
import com.luminavibe.entities.Post;
import com.luminavibe.entities.User;
import com.luminavibe.repositories.CommentRepository;
import com.luminavibe.repositories.PostRepository;
import com.luminavibe.repositories.UserRepository;
import com.luminavibe.services.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommentServiceImpl implements CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private com.luminavibe.services.NotificationService notificationService;

    @Override
    public CommentDto addComment(Integer userId, Integer postId, Integer parentCommentId, String content) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found"));

        Comment comment = new Comment();
        comment.setUser(user);
        comment.setPost(post);
        comment.setContent(content);

        if (parentCommentId != null) {
            Comment parent = commentRepository.findById(parentCommentId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Parent comment not found"));
            comment.setParentComment(parent);
        }

        Comment saved = commentRepository.save(comment);

        // Trigger notification
        try {
            if (!post.getUser().getUserId().equals(userId)) {
                String desc = user.getActualUsername() + " commented: " + (content.length() > 30 ? content.substring(0, 27) + "..." : content);
                notificationService.createNotification(
                        post.getUser().getUserId(),
                        userId,
                        "COMMENT",
                        post.getPostId(),
                        desc
                );
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return convertToDto(saved);
    }

    @Override
    public List<CommentDto> getCommentsForPost(Integer postId) {
        List<Comment> topLevelComments = commentRepository.findByPostPostIdAndParentCommentIsNullOrderByCreatedAtAsc(postId);
        return topLevelComments.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    private CommentDto convertToDto(Comment comment) {
        if (comment == null) return null;
        CommentDto dto = new CommentDto();
        dto.setCommentId(comment.getCommentId());
        dto.setPostId(comment.getPost().getPostId());
        dto.setUserId(comment.getUser().getUserId());
        dto.setUsername(comment.getUser().getActualUsername());
        dto.setUserAvatar(comment.getUser().getProfilePictureUrl());
        dto.setParentCommentId(comment.getParentComment() != null ? comment.getParentComment().getCommentId() : null);
        dto.setContent(comment.getContent());
        dto.setCreatedAt(comment.getCreatedAt());

        // Recursive population of nested replies
        List<Comment> replies = commentRepository.findByParentCommentCommentIdOrderByCreatedAtAsc(comment.getCommentId());
        List<CommentDto> replyDtos = replies.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        dto.setReplies(replyDtos);

        return dto;
    }
}
