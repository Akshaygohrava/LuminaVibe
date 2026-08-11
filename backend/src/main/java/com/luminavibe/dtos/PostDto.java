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
public class PostDto {

    @JsonProperty("post_id")
    private Integer postId;

    private UserDto user;

    private String content;

    private String location;

    @JsonProperty("is_archived")
    private Boolean isArchived;

    @JsonProperty("created_at")
    private LocalDateTime createdAt;

    @JsonProperty("updated_at")
    private LocalDateTime updatedAt;

    @JsonProperty("media_list")
    private List<PostMediaDto> mediaList;
}
