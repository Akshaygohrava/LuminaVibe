package com.luminavibe.controllers;

import com.luminavibe.dtos.FollowDto;
import com.luminavibe.dtos.FollowRequestDto;
import com.luminavibe.dtos.UserDto;
import com.luminavibe.entities.User;
import com.luminavibe.services.FollowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/follows")
@CrossOrigin
public class FollowController {

    @Autowired
    private FollowService followService;

    @PostMapping("/toggle/{targetUserId}")
    public ResponseEntity<FollowDto> toggleFollow(@PathVariable("targetUserId") Integer targetUserId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) auth.getPrincipal();
        return ResponseEntity.ok(followService.toggleFollow(user.getUserId(), targetUserId));
    }

    @PostMapping("/accept/{followerId}")
    public ResponseEntity<FollowDto> acceptRequest(@PathVariable("followerId") Integer followerId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) auth.getPrincipal();
        return ResponseEntity.ok(followService.acceptFollowRequest(user.getUserId(), followerId));
    }

    @PostMapping("/reject/{followerId}")
    public ResponseEntity<Map<String, String>> rejectRequest(@PathVariable("followerId") Integer followerId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) auth.getPrincipal();
        followService.rejectFollowRequest(user.getUserId(), followerId);
        return ResponseEntity.ok(Map.of("message", "Follow request rejected."));
    }

    @GetMapping("/status/{targetUserId}")
    public ResponseEntity<Map<String, String>> getStatus(@PathVariable("targetUserId") Integer targetUserId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) auth.getPrincipal();
        String status = followService.getFollowStatus(user.getUserId(), targetUserId);
        return ResponseEntity.ok(Map.of("status", status));
    }

    @GetMapping("/requests")
    public ResponseEntity<List<FollowRequestDto>> getPendingRequests() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) auth.getPrincipal();
        return ResponseEntity.ok(followService.getPendingRequests(user.getUserId()));
    }

    @GetMapping("/followers/{userId}")
    public ResponseEntity<List<UserDto>> getFollowers(@PathVariable("userId") Integer userId) {
        return ResponseEntity.ok(followService.getFollowers(userId));
    }

    @GetMapping("/following/{userId}")
    public ResponseEntity<List<UserDto>> getFollowing(@PathVariable("userId") Integer userId) {
        return ResponseEntity.ok(followService.getFollowing(userId));
    }
}
