package com.luminavibe.controllers;

import com.luminavibe.dtos.ConversationDto;
import com.luminavibe.dtos.MessageDto;
import com.luminavibe.dtos.UserDto;
import com.luminavibe.entities.User;
import com.luminavibe.repositories.UserRepository;
import com.luminavibe.services.MessageService;
import lombok.Data;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/messages")
@CrossOrigin
public class MessageController {

    @Autowired
    private MessageService messageService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ModelMapper modelMapper;

    @PostMapping
    public ResponseEntity<MessageDto> sendMessage(@RequestBody SendMessageRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) auth.getPrincipal();

        MessageDto dto = messageService.sendMessage(currentUser.getUserId(), request.getReceiverId(), request.getContent());
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/history/{otherUserId}")
    public ResponseEntity<List<MessageDto>> getChatHistory(@PathVariable("otherUserId") Integer otherUserId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) auth.getPrincipal();

        List<MessageDto> history = messageService.getChatHistory(currentUser.getUserId(), otherUserId);
        return ResponseEntity.ok(history);
    }

    @GetMapping("/conversations")
    public ResponseEntity<List<ConversationDto>> getConversations() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) auth.getPrincipal();

        List<ConversationDto> conversations = messageService.getConversationsList(currentUser.getUserId());
        return ResponseEntity.ok(conversations);
    }

    @PutMapping("/read/{senderId}")
    public ResponseEntity<Void> markAsRead(@PathVariable("senderId") Integer senderId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) auth.getPrincipal();

        messageService.markAsRead(senderId, currentUser.getUserId());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserDto>> getMessageUsers() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) auth.getPrincipal();

        // Retrieve all other users to allow initiating a chat
        List<User> users = userRepository.findAll();
        List<UserDto> userDtos = users.stream()
                .filter(u -> !u.getUserId().equals(currentUser.getUserId()))
                .map(u -> {
                    UserDto dto = modelMapper.map(u, UserDto.class);
                    dto.setUsername(u.getActualUsername());
                    return dto;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(userDtos);
    }

    @GetMapping("/unread-count")
    public ResponseEntity<java.util.Map<String, Long>> getUnreadCount() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) auth.getPrincipal();
        long count = messageService.getUnreadMessagesCount(currentUser.getUserId());
        return ResponseEntity.ok(java.util.Map.of("count", count));
    }

    @Data
    public static class SendMessageRequest {
        private Integer receiverId;
        private String content;
    }
}
