package com.luminavibe.services.impl;

import com.luminavibe.dtos.StoryDto;
import com.luminavibe.dtos.StoryMediaDto;
import com.luminavibe.entities.Follow;
import com.luminavibe.entities.Story;
import com.luminavibe.entities.StoryMedia;
import com.luminavibe.entities.User;
import com.luminavibe.repositories.FollowRepository;
import com.luminavibe.repositories.StoryRepository;
import com.luminavibe.repositories.UserRepository;
import com.luminavibe.services.StoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class StoryServiceImpl implements StoryService {

    @Autowired
    private StoryRepository storyRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FollowRepository followRepository;

    @Override
    public StoryDto createStory(Integer userId, MultipartFile[] files) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        if (files == null || files.length == 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "At least one media file is required for a story");
        }

        Story story = new Story();
        story.setUser(user);
        story.setCreatedAt(LocalDateTime.now());
        story.setExpiresAt(LocalDateTime.now().plusDays(1)); // Expires in 24 hours

        List<StoryMedia> mediaList = new ArrayList<>();

        File uploadDir = new File("uploads/stories");
        if (!uploadDir.exists()) {
            uploadDir.mkdirs();
        }

        for (MultipartFile file : files) {
            if (file.isEmpty()) continue;
            try {
                String originalName = file.getOriginalFilename();
                String extension = "";
                if (originalName != null && originalName.contains(".")) {
                    extension = originalName.substring(originalName.lastIndexOf("."));
                }
                String newFileName = UUID.randomUUID().toString() + extension;
                File destination = new File(uploadDir.getAbsolutePath() + File.separator + newFileName);
                Files.copy(file.getInputStream(), destination.toPath(), StandardCopyOption.REPLACE_EXISTING);

                String fileUrl = "http://localhost:8080/uploads/stories/" + newFileName;
                String contentType = file.getContentType();
                if (contentType == null) {
                    contentType = "image/jpeg";
                }

                StoryMedia media = new StoryMedia();
                media.setStory(story);
                media.setMediaUrl(fileUrl);
                media.setMediaType(contentType);
                mediaList.add(media);

            } catch (Exception e) {
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to store story file: " + e.getMessage());
            }
        }

        if (mediaList.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No valid media files uploaded");
        }

        story.setMediaList(mediaList);
        Story saved = storyRepository.save(story);

        return convertToDto(saved);
    }

    @Override
    public List<StoryDto> getActiveStories(Integer userId) {
        // Find creators the user follows
        List<Follow> followings = followRepository.findByFollowerUserIdAndStatus(userId, "ACCEPTED");
        List<Integer> creatorIds = followings.stream()
                .map(f -> f.getFollowing().getUserId())
                .collect(Collectors.toList());

        // Always include own stories
        creatorIds.add(userId);

        // Fetch active stories
        List<Story> activeStories = storyRepository.findByUserUserIdInAndExpiresAtAfterOrderByCreatedAtAsc(creatorIds, LocalDateTime.now());

        // Group stories by creator
        Map<Integer, List<Story>> grouped = new LinkedHashMap<>();
        for (Story story : activeStories) {
            grouped.computeIfAbsent(story.getUser().getUserId(), k -> new ArrayList<>()).add(story);
        }

        List<StoryDto> result = new ArrayList<>();
        for (Map.Entry<Integer, List<Story>> entry : grouped.entrySet()) {
            List<Story> userStories = entry.getValue();
            if (userStories.isEmpty()) continue;

            Story firstStory = userStories.get(0);
            User creator = firstStory.getUser();

            StoryDto dto = new StoryDto();
            dto.setStoryId(firstStory.getStoryId());
            dto.setUserId(creator.getUserId());
            dto.setUsername(creator.getActualUsername());
            dto.setFullName(creator.getFullName());
            dto.setProfilePictureUrl(creator.getProfilePictureUrl());
            dto.setCreatedAt(firstStory.getCreatedAt());
            dto.setExpiresAt(firstStory.getExpiresAt());

            List<StoryMediaDto> mediaDtos = new ArrayList<>();
            for (Story s : userStories) {
                for (StoryMedia sm : s.getMediaList()) {
                    StoryMediaDto smDto = new StoryMediaDto();
                    smDto.setMediaId(sm.getMediaId());
                    smDto.setMediaUrl(sm.getMediaUrl());
                    smDto.setMediaType(sm.getMediaType());
                    mediaDtos.add(smDto);
                }
            }
            dto.setMediaList(mediaDtos);
            result.add(dto);
        }

        return result;
    }

    private StoryDto convertToDto(Story story) {
        StoryDto dto = new StoryDto();
        dto.setStoryId(story.getStoryId());
        dto.setUserId(story.getUser().getUserId());
        dto.setUsername(story.getUser().getActualUsername());
        dto.setFullName(story.getUser().getFullName());
        dto.setProfilePictureUrl(story.getUser().getProfilePictureUrl());
        dto.setCreatedAt(story.getCreatedAt());
        dto.setExpiresAt(story.getExpiresAt());

        List<StoryMediaDto> mediaDtos = story.getMediaList().stream().map(sm -> {
            StoryMediaDto smDto = new StoryMediaDto();
            smDto.setMediaId(sm.getMediaId());
            smDto.setMediaUrl(sm.getMediaUrl());
            smDto.setMediaType(sm.getMediaType());
            return smDto;
        }).collect(Collectors.toList());

        dto.setMediaList(mediaDtos);
        return dto;
    }
}
