package com.luminavibe.controllers;

import com.luminavibe.dtos.LikeResponseDto;
import com.luminavibe.entities.TargetType;
import com.luminavibe.entities.User;
import com.luminavibe.services.LikeService;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/likes")
@CrossOrigin
public class LikeController {

    @Autowired
    private LikeService likeService;

    @PostMapping("/toggle")
    public ResponseEntity<LikeResponseDto> toggleLike(@RequestBody LikeRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) auth.getPrincipal();

        LikeResponseDto response = likeService.toggleLike(user.getUserId(), request.getTargetType(), request.getTargetId());
        return ResponseEntity.ok(response);
    }

    @Data
    public static class LikeRequest {
        private TargetType targetType;
        private Integer targetId;
    }
}
