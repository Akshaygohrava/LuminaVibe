package com.luminavibe.services;

import com.luminavibe.dtos.StoryDto;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

public interface StoryService {
    StoryDto createStory(Integer userId, MultipartFile[] files);
    List<StoryDto> getActiveStories(Integer userId);
}
