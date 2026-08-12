package com.luminavibe.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StoryDto {

    @JsonProperty("story_id")
    private Integer storyId;

    @JsonProperty("user_id")
    private Integer userId;

    private String username;

    @JsonProperty("full_name")
    private String fullName;

    @JsonProperty("profile_picture_url")
    private String profilePictureUrl;

    @JsonProperty("created_at")
    private LocalDateTime createdAt;

    @JsonProperty("expires_at")
    private LocalDateTime expiresAt;

    @JsonProperty("media_list")
    private List<StoryMediaDto> mediaList;
}
