package com.luminavibe.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CommentDto {
    private Integer commentId;
    private Integer postId;
    private Integer userId;
    private String username;
    private String userAvatar;
    private Integer parentCommentId;
    private String content;
    private LocalDateTime createdAt;
    private List<CommentDto> replies;
}
