package com.luminavibe.services;

import com.luminavibe.dtos.ConversationDto;
import com.luminavibe.dtos.MessageDto;
import java.util.List;

public interface MessageService {
    MessageDto sendMessage(Integer senderId, Integer receiverId, String content);
    List<MessageDto> getChatHistory(Integer userId1, Integer userId2);
    List<ConversationDto> getConversationsList(Integer userId);
    void markAsRead(Integer senderId, Integer receiverId);
}
