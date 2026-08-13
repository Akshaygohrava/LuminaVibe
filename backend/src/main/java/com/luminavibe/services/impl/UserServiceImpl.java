package com.luminavibe.services.impl;

import com.luminavibe.dtos.UserDto;
import com.luminavibe.entities.User;
import com.luminavibe.repositories.UserRepository;
import com.luminavibe.services.UserService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private org.springframework.jdbc.core.JdbcTemplate jdbcTemplate;

    @Override
    public UserDto register(UserDto userDto) {
        if (userRepository.existsByUsername(userDto.getUsername())) {
            throw new org.springframework.web.server.ResponseStatusException(
                org.springframework.http.HttpStatus.BAD_REQUEST,
                "Username is already taken"
            );
        }
        if (userRepository.existsByEmail(userDto.getEmail())) {
            throw new org.springframework.web.server.ResponseStatusException(
                org.springframework.http.HttpStatus.BAD_REQUEST,
                "Email is already taken"
            );
        }

        String hashedPassword = passwordEncoder.encode(userDto.getPassword());
        userDto.setPassword(hashedPassword);

        User user = modelMapper.map(userDto, User.class);
        if (user.getIsPrivate() == null) {
            user.setIsPrivate(false);
        }
        if (user.getIsVerified() == null) {
            user.setIsVerified(false);
        }
        User savedUser = userRepository.save(user);

        return convertToDto(savedUser);
    }

    @Override
    public List<UserDto> searchUsers(String query) {
        List<User> users = userRepository.findByUsernameContainingIgnoreCaseOrFullNameContainingIgnoreCase(query, query);
        return users.stream()
                .map(user -> convertToDto(user))
                .collect(Collectors.toList());
    }

    @Override
    public UserDto updateUser(Integer userId, UserDto userDto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(
                    org.springframework.http.HttpStatus.NOT_FOUND, "User not found"
                ));

        if (userDto.getUsername() != null && !userDto.getUsername().isBlank()) {
            User existingUser = userRepository.findByUsername(userDto.getUsername()).orElse(null);
            if (existingUser != null && !existingUser.getUserId().equals(userId)) {
                throw new org.springframework.web.server.ResponseStatusException(
                    org.springframework.http.HttpStatus.BAD_REQUEST, "Username is already taken"
                );
            }
            user.setUsername(userDto.getUsername());
        }

        if (userDto.getFullName() != null) {
            user.setFullName(userDto.getFullName());
        }
        if (userDto.getBio() != null) {
            user.setBio(userDto.getBio());
        }
        if (userDto.getProfilePictureUrl() != null) {
            user.setProfilePictureUrl(userDto.getProfilePictureUrl());
        }

        User savedUser = userRepository.save(user);
        return convertToDto(savedUser);
     }

    @Override
    public UserDto getUserByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        try {
            org.springframework.security.core.Authentication auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.isAuthenticated() && auth.getPrincipal() instanceof User) {
                User currentUser = (User) auth.getPrincipal();
                if (!currentUser.getActualUsername().equalsIgnoreCase(user.getActualUsername())) {
                    user.setProfileViews(user.getProfileViews() + 1);
                    userRepository.save(user);
                }
            }
        } catch (Exception e) {
            // Keep safe against unauthenticated contexts
        }

        return convertToDto(user);
    }

    private UserDto convertToDto(User user) {
        if (user == null) return null;
        UserDto dto = modelMapper.map(user, UserDto.class);
        dto.setUsername(user.getActualUsername());
        return dto;
    }

    @Override
    @org.springframework.transaction.annotation.Transactional
    public void deleteUser(Integer userId) {
        // 1. Delete bookmarks
        jdbcTemplate.update("DELETE FROM bookmarks WHERE user_id = ?", userId);
        jdbcTemplate.update("DELETE FROM bookmarks WHERE post_id IN (SELECT post_id FROM posts WHERE user_id = ?)", userId);

        // 2. Delete likes
        jdbcTemplate.update("DELETE FROM likes WHERE user_id = ?", userId);
        jdbcTemplate.update("DELETE FROM likes WHERE target_type = 'post' AND target_id IN (SELECT post_id FROM posts WHERE user_id = ?)", userId);
        jdbcTemplate.update("DELETE FROM likes WHERE target_type = 'comment' AND target_id IN (SELECT comment_id FROM comments WHERE user_id = ? OR post_id IN (SELECT post_id FROM posts WHERE user_id = ?))", userId, userId);

        // 3. Clear comment parents to avoid constraint violations
        jdbcTemplate.update("UPDATE comments SET parent_comment_id = NULL WHERE parent_comment_id IN (SELECT comment_id FROM (SELECT comment_id FROM comments WHERE user_id = ? OR post_id IN (SELECT post_id FROM posts WHERE user_id = ?)) tmp)", userId, userId);
        // Delete comments
        jdbcTemplate.update("DELETE FROM comments WHERE user_id = ? OR post_id IN (SELECT post_id FROM posts WHERE user_id = ?)", userId, userId);

        // 4. Delete post media
        jdbcTemplate.update("DELETE FROM post_media WHERE post_id IN (SELECT post_id FROM posts WHERE user_id = ?)", userId);

        // 5. Delete posts
        jdbcTemplate.update("DELETE FROM posts WHERE user_id = ?", userId);

        // 6. Delete story media
        jdbcTemplate.update("DELETE FROM story_media WHERE story_id IN (SELECT story_id FROM stories WHERE user_id = ?)", userId);

        // 7. Delete stories
        jdbcTemplate.update("DELETE FROM stories WHERE user_id = ?", userId);

        // 8. Delete notifications
        jdbcTemplate.update("DELETE FROM notifications WHERE recipient_id = ? OR creator_id = ?", userId, userId);

        // 9. Delete messages
        jdbcTemplate.update("DELETE FROM messages WHERE sender_id = ? OR receiver_id = ?", userId, userId);

        // 10. Delete follows
        jdbcTemplate.update("DELETE FROM follows WHERE follower_id = ? OR following_id = ?", userId, userId);

        // 11. Delete user settings
        jdbcTemplate.update("DELETE FROM user_settings WHERE user_id = ?", userId);

        // 12. Delete user
        jdbcTemplate.update("DELETE FROM users WHERE user_id = ?", userId);
    }
}
