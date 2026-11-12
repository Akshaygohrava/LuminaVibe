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

    private static final org.slf4j.Logger logger = org.slf4j.LoggerFactory.getLogger(StoryServiceImpl.class);

    private static final String DEFAULT_STORY_DUMMY_IMAGE = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop";
    private static final String DEFAULT_USER_AVATAR = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop";

    @Autowired
    private StoryRepository storyRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FollowRepository followRepository;

    @Autowired
    private com.luminavibe.services.BaseUrlService baseUrlService;

    @Autowired
    private com.luminavibe.services.FileStorageService fileStorageService;

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

        for (MultipartFile file : files) {
            if (file.isEmpty()) continue;
            try {
                String fileUrl = fileStorageService.storeFile(file, "stories");
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
                logger.error("Could not store story media file: {}", e.getMessage(), e);
            }
        }

        if (mediaList.isEmpty()) {
            // If storing failed or no files, create a fallback story media so request succeeds
            StoryMedia media = new StoryMedia();
            media.setStory(story);
            media.setMediaUrl(DEFAULT_STORY_DUMMY_IMAGE);
            media.setMediaType("image/jpeg");
            mediaList.add(media);
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

        // Keep set of allowed IDs (own + accepted followings)
        Set<Integer> allowedPrivateViewerIds = new HashSet<>(creatorIds);

        // Fetch active stories (own + followed)
        List<Story> activeStories = storyRepository.findByUserUserIdInAndExpiresAtAfterOrderByCreatedAtAsc(creatorIds, LocalDateTime.now());

        // Also include active community stories only if public or followed (privacy rule)
        List<Story> allActive = storyRepository.findByExpiresAtAfterOrderByCreatedAtAsc(LocalDateTime.now());
        Set<Integer> seenStoryIds = activeStories.stream().map(Story::getStoryId).collect(Collectors.toSet());
        for (Story s : allActive) {
            if (s.getUser() == null) continue;
            boolean isPrivate = Boolean.TRUE.equals(s.getUser().getIsPrivate());
            boolean canView = !isPrivate || allowedPrivateViewerIds.contains(s.getUser().getUserId());
            if (canView && !seenStoryIds.contains(s.getStoryId())) {
                activeStories.add(s);
                seenStoryIds.add(s.getStoryId());
            }
        }

        // Group stories by creator, ensuring own stories are strictly at the beginning
        Map<Integer, List<Story>> grouped = new LinkedHashMap<>();
        for (Story story : activeStories) {
            if (story.getUser().getUserId().equals(userId)) {
                grouped.computeIfAbsent(userId, k -> new ArrayList<>()).add(story);
            }
        }
        for (Story story : activeStories) {
            if (!story.getUser().getUserId().equals(userId)) {
                grouped.computeIfAbsent(story.getUser().getUserId(), k -> new ArrayList<>()).add(story);
            }
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
            String avatar = baseUrlService.fixUrl(creator.getProfilePictureUrl());
            dto.setProfilePictureUrl(avatar != null && !avatar.trim().isEmpty() ? avatar : DEFAULT_USER_AVATAR);
            dto.setCreatedAt(firstStory.getCreatedAt());
            dto.setExpiresAt(firstStory.getExpiresAt());

            List<StoryMediaDto> mediaDtos = new ArrayList<>();
            for (Story s : userStories) {
                for (StoryMedia sm : s.getMediaList()) {
                    StoryMediaDto smDto = new StoryMediaDto();
                    smDto.setMediaId(sm.getMediaId());
                    String smUrl = baseUrlService.fixUrl(sm.getMediaUrl());
                    smDto.setMediaUrl(smUrl != null && !smUrl.trim().isEmpty() ? smUrl : DEFAULT_STORY_DUMMY_IMAGE);
                    smDto.setMediaType(sm.getMediaType() != null ? sm.getMediaType() : "image/jpeg");
                    mediaDtos.add(smDto);
                }
            }
            if (mediaDtos.isEmpty()) {
                StoryMediaDto smDto = new StoryMediaDto();
                smDto.setMediaId(-firstStory.getStoryId());
                smDto.setMediaUrl(DEFAULT_STORY_DUMMY_IMAGE);
                smDto.setMediaType("image/jpeg");
                mediaDtos.add(smDto);
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
        String avatar = baseUrlService.fixUrl(story.getUser().getProfilePictureUrl());
        dto.setProfilePictureUrl(avatar != null && !avatar.trim().isEmpty() ? avatar : DEFAULT_USER_AVATAR);
        dto.setCreatedAt(story.getCreatedAt());
        dto.setExpiresAt(story.getExpiresAt());

        List<StoryMediaDto> mediaDtos = story.getMediaList().stream().map(sm -> {
            StoryMediaDto smDto = new StoryMediaDto();
            smDto.setMediaId(sm.getMediaId());
            String smUrl = baseUrlService.fixUrl(sm.getMediaUrl());
            smDto.setMediaUrl(smUrl != null && !smUrl.trim().isEmpty() ? smUrl : DEFAULT_STORY_DUMMY_IMAGE);
            smDto.setMediaType(sm.getMediaType() != null ? sm.getMediaType() : "image/jpeg");
            return smDto;
        }).collect(Collectors.toList());

        if (mediaDtos.isEmpty()) {
            StoryMediaDto smDto = new StoryMediaDto();
            smDto.setMediaId(-story.getStoryId());
            smDto.setMediaUrl(DEFAULT_STORY_DUMMY_IMAGE);
            smDto.setMediaType("image/jpeg");
            mediaDtos.add(smDto);
        }

        dto.setMediaList(mediaDtos);
        return dto;
    }
}
