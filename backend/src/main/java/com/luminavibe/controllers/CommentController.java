package com.luminavibe.controllers;

import com.luminavibe.dtos.CommentDto;
import com.luminavibe.entities.User;
import com.luminavibe.services.CommentService;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/posts")
@CrossOrigin
public class CommentController {

    @Autowired
    private CommentService commentService;

    @PostMapping("/{postId}/comments")
    public ResponseEntity<CommentDto> addComment(
            @PathVariable("postId") Integer postId,
            @RequestBody CommentRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) auth.getPrincipal();

        CommentDto commentDto = commentService.addComment(user.getUserId(), postId, request.getParentCommentId(), request.getContent());
        return new ResponseEntity<>(commentDto, HttpStatus.CREATED);
    }

    @GetMapping("/{postId}/comments")
    public ResponseEntity<List<CommentDto>> getCommentsForPost(@PathVariable("postId") Integer postId) {
        return ResponseEntity.ok(commentService.getCommentsForPost(postId));
    }

    @Data
    public static class CommentRequest {
        private String content;
        private Integer parentCommentId;
    }
}
