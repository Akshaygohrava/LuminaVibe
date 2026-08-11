package com.luminavibe.services;

import com.luminavibe.dtos.FollowDto;
import com.luminavibe.dtos.FollowRequestDto;
import com.luminavibe.dtos.UserDto;
import java.util.List;

public interface FollowService {
    FollowDto toggleFollow(Integer followerId, Integer targetUserId);
    FollowDto acceptFollowRequest(Integer ownerId, Integer followerId);
    void rejectFollowRequest(Integer ownerId, Integer followerId);
    String getFollowStatus(Integer followerId, Integer targetUserId);
    List<UserDto> getFollowers(Integer userId);
    List<UserDto> getFollowing(Integer userId);
    List<FollowRequestDto> getPendingRequests(Integer userId);
}
