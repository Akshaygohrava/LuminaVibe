package com.luminavibe.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PostMediaDto {

    @JsonProperty("media_id")
    private Integer mediaId;

    @JsonProperty("media_url")
    private String mediaUrl;

    @JsonProperty("media_type")
    private String mediaType;
}
