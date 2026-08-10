package com.luminavibe.services;

import com.luminavibe.dtos.UserDto;
import java.util.List;

public interface UserService {
    UserDto register(UserDto userDto);
    List<UserDto> searchUsers(String query);
}
