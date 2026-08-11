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
        return convertToDto(user);
    }

    private UserDto convertToDto(User user) {
        if (user == null) return null;
        UserDto dto = modelMapper.map(user, UserDto.class);
        dto.setUsername(user.getActualUsername());
        return dto;
    }
}
