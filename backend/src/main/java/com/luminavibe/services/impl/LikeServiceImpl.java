package com.luminavibe.services.impl;

import com.luminavibe.dtos.LikeResponseDto;
import com.luminavibe.entities.Like;
import com.luminavibe.entities.TargetType;
import com.luminavibe.entities.User;
import com.luminavibe.repositories.LikeRepository;
import com.luminavibe.repositories.UserRepository;
import com.luminavibe.services.LikeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.util.Optional;

@Service
public class LikeServiceImpl implements LikeService {

    @Autowired
    private LikeRepository likeRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public LikeResponseDto toggleLike(Integer userId, TargetType targetType, Integer targetId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        Optional<Like> existing = likeRepository.findByUserUserIdAndTargetTypeAndTargetId(userId, targetType, targetId);
        boolean liked;
        if (existing.isPresent()) {
            likeRepository.delete(existing.get());
            liked = false;
        } else {
            Like like = new Like();
            like.setUser(user);
            like.setTargetType(targetType);
            like.setTargetId(targetId);
            likeRepository.save(like);
            liked = true;
        }

        int count = likeRepository.countByTargetTypeAndTargetId(targetType, targetId);
        return new LikeResponseDto(liked, count);
    }
}
