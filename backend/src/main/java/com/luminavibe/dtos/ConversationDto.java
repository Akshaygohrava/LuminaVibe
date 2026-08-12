package com.luminavibe.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ConversationDto {
    private Integer otherUserId;
    private String otherUsername;
    private String otherFullName;
    private String otherProfilePictureUrl;
    private String lastMessage;
    private LocalDateTime lastMessageTime;
    private boolean lastMessageIsRead;
    private boolean lastMessageSentByMe;
}
