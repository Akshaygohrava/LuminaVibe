package com.luminavibe.services.impl;

import com.luminavibe.dtos.NotificationDto;
import com.luminavibe.entities.Notification;
import com.luminavibe.entities.User;
import com.luminavibe.repositories.NotificationRepository;
import com.luminavibe.repositories.UserRepository;
import com.luminavibe.services.NotificationService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationServiceImpl implements NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public NotificationDto createNotification(Integer recipientId, Integer creatorId, String type, Integer targetId, String message) {
        User recipient = userRepository.findById(recipientId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Recipient not found."));

        User creator = null;
        if (creatorId != null) {
            creator = userRepository.findById(creatorId).orElse(null);
        }

        Notification notification = new Notification();
        notification.setRecipient(recipient);
        notification.setCreator(creator);
        notification.setType(type);
        notification.setTargetId(targetId);
        notification.setMessage(message);
        notification.setIsRead(false);

        Notification saved = notificationRepository.save(notification);
        return convertToDto(saved);
    }

    @Override
    public List<NotificationDto> getNotificationsForUser(Integer userId) {
        List<Notification> list = notificationRepository.findByRecipientUserIdOrderByCreatedAtDesc(userId);
        return list.stream().map(this::convertToDto).collect(Collectors.toList());
    }

    @Override
    public long getUnreadNotificationsCount(Integer userId) {
        return notificationRepository.countByRecipientUserIdAndIsReadFalse(userId);
    }

    @Override
    public void markAllAsRead(Integer userId) {
        List<Notification> unread = notificationRepository.findByRecipientUserIdAndIsReadFalse(userId);
        for (Notification n : unread) {
            n.setIsRead(true);
        }
        notificationRepository.saveAll(unread);
    }

    private NotificationDto convertToDto(Notification entity) {
        NotificationDto dto = modelMapper.map(entity, NotificationDto.class);
        dto.setRecipientId(entity.getRecipient().getUserId());
        if (entity.getCreator() != null) {
            dto.setCreatorId(entity.getCreator().getUserId());
            dto.setCreatorUsername(entity.getCreator().getActualUsername());
            dto.setCreatorProfilePictureUrl(entity.getCreator().getProfilePictureUrl());
        }
        return dto;
    }
}
