package com.luminavibe.controllers;

import com.luminavibe.dtos.UserDto;
import com.luminavibe.services.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.Map;
import java.util.UUID;
import java.io.File;

@RestController
@RequestMapping("/users")
@CrossOrigin
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<UserDto> addUser(@Valid @RequestBody UserDto userDto) {
        return new ResponseEntity<UserDto>(userService.register(userDto), HttpStatus.CREATED);
    }

    @GetMapping("/search")
    public ResponseEntity<java.util.List<UserDto>> searchUsers(@RequestParam("query") String query) {
        return ResponseEntity.ok(userService.searchUsers(query));
    }

    @GetMapping("/username/{username}")
    public ResponseEntity<UserDto> getUserByUsername(@PathVariable("username") String username) {
        return ResponseEntity.ok(userService.getUserByUsername(username));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserDto> updateUser(@PathVariable("id") Integer id, @RequestBody UserDto userDto) {
        return ResponseEntity.ok(userService.updateUser(id, userDto));
    }

    @PostMapping("/upload-avatar")
    public ResponseEntity<?> uploadAvatar(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("File is empty");
        }
        try {
            File uploadDir = new File("uploads");
            if (!uploadDir.exists()) {
                uploadDir.mkdirs();
            }

            String originalFileName = file.getOriginalFilename();
            String fileExtension = "";
            if (originalFileName != null && originalFileName.contains(".")) {
                fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
            }
            String newFileName = UUID.randomUUID().toString() + fileExtension;

            File destinationFile = new File(uploadDir.getAbsolutePath() + File.separator + newFileName);
            file.transferTo(destinationFile);

            String fileUrl = "http://localhost:8080/uploads/" + newFileName;
            return ResponseEntity.ok(Map.of("url", fileUrl));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to upload file: " + e.getMessage());
        }
    }

    @Autowired
    private com.luminavibe.repositories.PostRepository postRepository;

    @Autowired
    private com.luminavibe.repositories.CommentRepository commentRepository;

    @Autowired
    private com.luminavibe.repositories.LikeRepository likeRepository;

    @GetMapping("/insights")
    public ResponseEntity<?> getInsights() {
        org.springframework.security.core.Authentication auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        com.luminavibe.entities.User user = (com.luminavibe.entities.User) auth.getPrincipal();

        java.util.List<com.luminavibe.entities.Post> posts = postRepository.findByUserUserIdOrderByCreatedAtDesc(user.getUserId());
        int totalPosts = posts.size();

        int totalLikes = 0;
        for (com.luminavibe.entities.Post post : posts) {
            totalLikes += likeRepository.countByTargetTypeAndTargetId(com.luminavibe.entities.TargetType.post, post.getPostId());
        }

        int totalComments = 0;
        for (com.luminavibe.entities.Post post : posts) {
            totalComments += commentRepository.findByPostPostIdAndParentCommentIsNullOrderByCreatedAtAsc(post.getPostId()).size();
        }

        int profileViews = user.getProfileViews() != null ? user.getProfileViews() : 0;

        double engagementRate = 0.0;
        if (totalPosts > 0) {
            engagementRate = ((double)(totalLikes + totalComments) / totalPosts) * 10.0;
            if (engagementRate > 100.0) engagementRate = 98.4;
        }

        return ResponseEntity.ok(Map.of(
            "posts_count", totalPosts,
            "likes_count", totalLikes,
            "comments_count", totalComments,
            "profile_views", profileViews,
            "engagement_rate", String.format("%.2f", engagementRate) + "%"
        ));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable("id") Integer id) {
        org.springframework.security.core.Authentication auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        com.luminavibe.entities.User user = (com.luminavibe.entities.User) auth.getPrincipal();

        if (!user.getUserId().equals(id)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You can only delete your own account.");
        }

        userService.deleteUser(id);
        return ResponseEntity.ok(Map.of("message", "Account and all associated data deleted successfully."));
    }
}
