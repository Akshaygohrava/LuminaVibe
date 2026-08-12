package com.luminavibe.services;

import com.luminavibe.dtos.NotificationDto;
import java.util.List;

public interface NotificationService {
    NotificationDto createNotification(Integer recipientId, Integer creatorId, String type, Integer targetId, String message);
    List<NotificationDto> getNotificationsForUser(Integer userId);
    long getUnreadNotificationsCount(Integer userId);
    void markAllAsRead(Integer userId);
}
