package com.luminavibe.services;

import com.luminavibe.dtos.LikeResponseDto;
import com.luminavibe.entities.TargetType;

public interface LikeService {
    LikeResponseDto toggleLike(Integer userId, TargetType targetType, Integer targetId);
}
