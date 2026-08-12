package com.luminavibe.controllers;

import com.luminavibe.dtos.StoryDto;
import com.luminavibe.entities.User;
import com.luminavibe.services.StoryService;
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
@RequestMapping("/stories")
@CrossOrigin
public class StoryController {

    @Autowired
    private StoryService storyService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<StoryDto> createStory(@RequestParam("files") MultipartFile[] files) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) auth.getPrincipal();

        StoryDto storyDto = storyService.createStory(user.getUserId(), files);
        return new ResponseEntity<>(storyDto, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<StoryDto>> getActiveStories() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) auth.getPrincipal();

        List<StoryDto> stories = storyService.getActiveStories(user.getUserId());
        return ResponseEntity.ok(stories);
    }
}
