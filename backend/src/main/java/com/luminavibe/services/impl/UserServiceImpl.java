package com.luminavibe.services.impl;

import com.luminavibe.dtos.UserDto;
import com.luminavibe.entities.User;
import com.luminavibe.repositories.UserRepository;
import com.luminavibe.services.UserService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

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

        return modelMapper.map(savedUser, UserDto.class);
    }
}
