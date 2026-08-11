package com.luminavibe.services;

import com.luminavibe.dtos.PostDto;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

public interface PostService {
    PostDto createPost(Integer userId, String content, String location, MultipartFile[] files);
    List<PostDto> getAllPosts();
    List<PostDto> getPostsByUser(Integer userId);
}
