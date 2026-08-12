package com.luminavibe.services.impl;

import com.luminavibe.dtos.ConversationDto;
import com.luminavibe.dtos.MessageDto;
import com.luminavibe.entities.Message;
import com.luminavibe.entities.User;
import com.luminavibe.repositories.MessageRepository;
import com.luminavibe.repositories.UserRepository;
import com.luminavibe.services.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MessageServiceImpl implements MessageService {

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public MessageDto sendMessage(Integer senderId, Integer receiverId, String content) {
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Sender not found"));
        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Receiver not found"));

        Message msg = new Message();
        msg.setSender(sender);
        msg.setReceiver(receiver);
        msg.setContent(content);
        msg.setIsRead(false);

        Message saved = messageRepository.save(msg);
        return convertToDto(saved);
    }

    @Override
    public List<MessageDto> getChatHistory(Integer userId1, Integer userId2) {
        List<Message> history = messageRepository.findChatHistory(userId1, userId2);
        return history.stream().map(this::convertToDto).collect(Collectors.toList());
    }

    @Override
    public List<ConversationDto> getConversationsList(Integer userId) {
        List<Message> conversations = messageRepository.findConversations(userId);
        List<ConversationDto> dtos = new ArrayList<>();

        for (Message m : conversations) {
            User otherUser = m.getSender().getUserId().equals(userId) ? m.getReceiver() : m.getSender();
            ConversationDto dto = new ConversationDto();
            dto.setOtherUserId(otherUser.getUserId());
            dto.setOtherUsername(otherUser.getActualUsername());
            dto.setOtherFullName(otherUser.getFullName());
            dto.setOtherProfilePictureUrl(otherUser.getProfilePictureUrl());
            dto.setLastMessage(m.getContent());
            dto.setLastMessageTime(m.getCreatedAt());
            dto.setLastMessageIsRead(m.getIsRead());
            dto.setLastMessageSentByMe(m.getSender().getUserId().equals(userId));
            dtos.add(dto);
        }

        return dtos;
    }

    @Override
    public void markAsRead(Integer senderId, Integer receiverId) {
        List<Message> unread = messageRepository.findBySenderUserIdAndReceiverUserIdAndIsReadFalse(senderId, receiverId);
        for (Message m : unread) {
            m.setIsRead(true);
            m.setReadAt(LocalDateTime.now());
        }
        messageRepository.saveAll(unread);
    }

    private MessageDto convertToDto(Message m) {
        if (m == null) return null;
        MessageDto dto = new MessageDto();
        dto.setMessageId(m.getMessageId());
        dto.setSenderId(m.getSender().getUserId());
        dto.setSenderUsername(m.getSender().getActualUsername());
        dto.setReceiverId(m.getReceiver().getUserId());
        dto.setReceiverUsername(m.getReceiver().getActualUsername());
        dto.setContent(m.getContent());
        dto.setIsRead(m.getIsRead());
        dto.setReadAt(m.getReadAt());
        dto.setCreatedAt(m.getCreatedAt());
        return dto;
    }
}
