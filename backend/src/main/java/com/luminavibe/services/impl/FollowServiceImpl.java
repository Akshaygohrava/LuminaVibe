package com.luminavibe.services.impl;

import com.luminavibe.dtos.FollowDto;
import com.luminavibe.dtos.FollowRequestDto;
import com.luminavibe.dtos.UserDto;
import com.luminavibe.entities.Follow;
import com.luminavibe.entities.User;
import com.luminavibe.repositories.FollowRepository;
import com.luminavibe.repositories.UserRepository;
import com.luminavibe.services.FollowService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class FollowServiceImpl implements FollowService {

    @Autowired
    private FollowRepository followRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public FollowDto toggleFollow(Integer followerId, Integer targetUserId) {
        if (followerId.equals(targetUserId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "You cannot follow yourself.");
        }

        User follower = userRepository.findById(followerId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Follower not found."));

        User target = userRepository.findById(targetUserId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Target user not found."));

        Optional<Follow> existingFollow = followRepository.findByFollowerUserIdAndFollowingUserId(followerId, targetUserId);

        if (existingFollow.isPresent()) {
            followRepository.delete(existingFollow.get());
            return new FollowDto(followerId, targetUserId, "NOT_FOLLOWING");
        } else {
            Follow follow = new Follow();
            follow.setFollower(follower);
            follow.setFollowing(target);
            
            // Set status to PENDING if private, ACCEPTED if public
            if (Boolean.TRUE.equals(target.getIsPrivate())) {
                follow.setStatus("PENDING");
            } else {
                follow.setStatus("ACCEPTED");
            }

            Follow saved = followRepository.save(follow);
            return new FollowDto(followerId, targetUserId, saved.getStatus());
        }
    }

    @Override
    public FollowDto acceptFollowRequest(Integer ownerId, Integer followerId) {
        Follow follow = followRepository.findByFollowerUserIdAndFollowingUserId(followerId, ownerId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Follow request not found."));

        if (!"PENDING".equals(follow.getStatus())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Follow request is already accepted.");
        }

        follow.setStatus("ACCEPTED");
        Follow saved = followRepository.save(follow);
        return new FollowDto(followerId, ownerId, saved.getStatus());
    }

    @Override
    public void rejectFollowRequest(Integer ownerId, Integer followerId) {
        Follow follow = followRepository.findByFollowerUserIdAndFollowingUserId(followerId, ownerId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Follow request not found."));

        followRepository.delete(follow);
    }

    @Override
    public String getFollowStatus(Integer followerId, Integer targetUserId) {
        if (followerId.equals(targetUserId)) {
            return "SELF";
        }
        Optional<Follow> follow = followRepository.findByFollowerUserIdAndFollowingUserId(followerId, targetUserId);
        return follow.map(Follow::getStatus).orElse("NOT_FOLLOWING");
    }

    @Override
    public List<UserDto> getFollowers(Integer userId) {
        List<Follow> follows = followRepository.findByFollowingUserIdAndStatus(userId, "ACCEPTED");
        return follows.stream()
                .map(f -> convertUserToDto(f.getFollower()))
                .collect(Collectors.toList());
    }

    @Override
    public List<UserDto> getFollowing(Integer userId) {
        List<Follow> follows = followRepository.findByFollowerUserIdAndStatus(userId, "ACCEPTED");
        return follows.stream()
                .map(f -> convertUserToDto(f.getFollowing()))
                .collect(Collectors.toList());
    }

    @Override
    public List<FollowRequestDto> getPendingRequests(Integer userId) {
        List<Follow> follows = followRepository.findByFollowingUserIdAndStatus(userId, "PENDING");
        return follows.stream().map(f -> {
            FollowRequestDto dto = new FollowRequestDto();
            dto.setFollower(convertUserToDto(f.getFollower()));
            dto.setStatus(f.getStatus());
            return dto;
        }).collect(Collectors.toList());
    }

    private UserDto convertUserToDto(User user) {
        if (user == null) return null;
        UserDto dto = modelMapper.map(user, UserDto.class);
        dto.setUsername(user.getActualUsername());
        return dto;
    }
}
