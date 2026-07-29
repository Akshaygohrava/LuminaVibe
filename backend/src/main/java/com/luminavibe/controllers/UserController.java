package com.luminavibe.controllers;

import com.luminavibe.dtos.UserDto;
import com.luminavibe.services.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
}
