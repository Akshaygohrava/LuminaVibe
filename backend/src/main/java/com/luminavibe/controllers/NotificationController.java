package com.luminavibe.controllers;

import com.luminavibe.dtos.NotificationDto;
import com.luminavibe.entities.User;
import com.luminavibe.services.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/notifications")
@CrossOrigin
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @GetMapping
    public ResponseEntity<List<NotificationDto>> getNotifications() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) auth.getPrincipal();
        return ResponseEntity.ok(notificationService.getNotificationsForUser(currentUser.getUserId()));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<Map<String, Long>> getUnreadCount() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) auth.getPrincipal();
        long count = notificationService.getUnreadNotificationsCount(currentUser.getUserId());
        return ResponseEntity.ok(Map.of("count", count));
    }

    @PutMapping("/read")
    public ResponseEntity<Map<String, String>> markAllAsRead() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) auth.getPrincipal();
        notificationService.markAllAsRead(currentUser.getUserId());
        return ResponseEntity.ok(Map.of("message", "All notifications marked as read."));
    }
}
