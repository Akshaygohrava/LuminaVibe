package com.luminavibe.repositories;

import com.luminavibe.entities.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Integer> {

    @Query("SELECT m FROM Message m WHERE (m.sender.userId = :userId1 AND m.receiver.userId = :userId2) OR (m.sender.userId = :userId2 AND m.receiver.userId = :userId1) ORDER BY m.createdAt ASC")
    List<Message> findChatHistory(@Param("userId1") Integer userId1, @Param("userId2") Integer userId2);

    @Query("SELECT m FROM Message m WHERE m.messageId IN (" +
           "  SELECT MAX(m2.messageId) FROM Message m2 WHERE m2.sender.userId = :userId OR m2.receiver.userId = :userId " +
           "  GROUP BY CASE WHEN m2.sender.userId = :userId THEN m2.receiver.userId ELSE m2.sender.userId END" +
           ") ORDER BY m.createdAt DESC")
    List<Message> findConversations(@Param("userId") Integer userId);

    List<Message> findBySenderUserIdAndReceiverUserIdAndIsReadFalse(Integer senderId, Integer receiverId);
    long countByReceiverUserIdAndIsReadFalse(Integer receiverId);
}
