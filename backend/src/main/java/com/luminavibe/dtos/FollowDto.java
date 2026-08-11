package com.luminavibe.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FollowDto {

    @JsonProperty("follower_id")
    private Integer followerId;

    @JsonProperty("following_id")
    private Integer followingId;

    private String status;
}
