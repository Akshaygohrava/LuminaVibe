package com.luminavibe.controllers;

import com.luminavibe.dtos.PostDto;
import com.luminavibe.entities.User;
import com.luminavibe.services.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

@RestController
@RequestMapping("/posts")
@CrossOrigin
public class PostController {

    @Autowired
    private PostService postService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<PostDto> createPost(
            @RequestParam("content") String content,
            @RequestParam(value = "location", required = false) String location,
            @RequestParam("files") MultipartFile[] files) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) auth.getPrincipal();
        
        PostDto postDto = postService.createPost(user.getUserId(), content, location, files);
        return new ResponseEntity<>(postDto, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<PostDto>> getAllPosts() {
        return ResponseEntity.ok(postService.getAllPosts());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<PostDto>> getPostsByUser(@PathVariable("userId") Integer userId) {
        return ResponseEntity.ok(postService.getPostsByUser(userId));
    }

    @PutMapping("/{postId}")
    public ResponseEntity<PostDto> updatePost(
            @PathVariable("postId") Integer postId,
            @RequestBody PostUpdateRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) auth.getPrincipal();
        PostDto updated = postService.updatePost(user.getUserId(), postId, request.getContent(), request.getLocation());
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{postId}")
    public ResponseEntity<Void> deletePost(@PathVariable("postId") Integer postId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) auth.getPrincipal();
        postService.deletePost(user.getUserId(), postId);
        return ResponseEntity.noContent().build();
    }

    public static class PostUpdateRequest {
        private String content;
        private String location;

        public String getContent() { return content; }
        public void setContent(String content) { this.content = content; }
        public String getLocation() { return location; }
        public void setLocation(String location) { this.location = location; }
    }
}
