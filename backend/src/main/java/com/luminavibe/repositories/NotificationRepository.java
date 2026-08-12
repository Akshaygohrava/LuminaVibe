package com.luminavibe.repositories;

import com.luminavibe.entities.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Integer> {
    List<Notification> findByRecipientUserIdOrderByCreatedAtDesc(Integer recipientId);
    List<Notification> findByRecipientUserIdAndIsReadFalse(Integer recipientId);
    long countByRecipientUserIdAndIsReadFalse(Integer recipientId);
}
