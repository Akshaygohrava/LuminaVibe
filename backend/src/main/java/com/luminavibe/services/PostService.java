package com.luminavibe.services;

import com.luminavibe.dtos.PostDto;
import com.luminavibe.entities.Post;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

public interface PostService {
    PostDto createPost(Integer userId, String content, String location, MultipartFile[] files);
    List<PostDto> getAllPosts();
    List<PostDto> getPostsByUser(Integer userId);
    PostDto updatePost(Integer userId, Integer postId, String content, String location);
    void deletePost(Integer userId, Integer postId);
    PostDto convertToDto(Post post);
}
