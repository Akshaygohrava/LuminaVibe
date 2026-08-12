package com.luminavibe.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class NotificationDto {
    private Integer notificationId;
    private Integer recipientId;
    private Integer creatorId;
    private String creatorUsername;
    private String creatorProfilePictureUrl;
    private String type; // LIKE, COMMENT, FOLLOW, FOLLOW_REQUEST
    private Integer targetId;
    private String message;
    private Boolean isRead;
    private LocalDateTime createdAt;
}
