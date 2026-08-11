package com.luminavibe.services.impl;

import com.luminavibe.dtos.PostDto;
import com.luminavibe.entities.Post;
import com.luminavibe.entities.PostMedia;
import com.luminavibe.entities.User;
import com.luminavibe.repositories.PostRepository;
import com.luminavibe.repositories.UserRepository;
import com.luminavibe.services.PostService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import java.io.File;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class PostServiceImpl implements PostService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public PostDto createPost(Integer userId, String content, String location, MultipartFile[] files) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        Post post = new Post();
        post.setUser(user);
        post.setContent(content);
        post.setLocation(location);
        post.setIsArchived(false);

        List<PostMedia> mediaList = new ArrayList<>();

        if (files != null && files.length > 0) {
            // Ensure posts upload directory exists
            File uploadDir = new File("uploads/posts");
            if (!uploadDir.exists()) {
                uploadDir.mkdirs();
            }

            for (MultipartFile file : files) {
                if (file.isEmpty()) continue;
                try {
                    String originalName = file.getOriginalFilename();
                    String extension = "";
                    if (originalName != null && originalName.contains(".")) {
                        extension = originalName.substring(originalName.lastIndexOf("."));
                    }
                    String newFileName = UUID.randomUUID().toString() + extension;
                    File destination = new File(uploadDir.getAbsolutePath() + File.separator + newFileName);
                    Files.copy(file.getInputStream(), destination.toPath(), StandardCopyOption.REPLACE_EXISTING);

                    String fileUrl = "http://localhost:8080/uploads/posts/" + newFileName;
                    String contentType = file.getContentType();
                    if (contentType == null) {
                        contentType = "image/jpeg"; // default fallback
                    }

                    PostMedia media = new PostMedia();
                    media.setPost(post);
                    media.setMediaUrl(fileUrl);
                    media.setMediaType(contentType);
                    mediaList.add(media);
                } catch (Exception e) {
                    throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to save file: " + e.getMessage());
                }
            }
        }

        post.setMediaList(mediaList);
        Post savedPost = postRepository.save(post);

        return convertToDto(savedPost);
    }

    @Override
    public List<PostDto> getAllPosts() {
        List<Post> posts = postRepository.findAllByOrderByCreatedAtDesc();
        return posts.stream().map(this::convertToDto).collect(Collectors.toList());
    }

    @Override
    public List<PostDto> getPostsByUser(Integer userId) {
        List<Post> posts = postRepository.findByUserUserIdOrderByCreatedAtDesc(userId);
        return posts.stream().map(this::convertToDto).collect(Collectors.toList());
    }

    private PostDto convertToDto(Post post) {
        if (post == null) return null;
        PostDto dto = modelMapper.map(post, PostDto.class);
        if (dto.getUser() != null && post.getUser() != null) {
            dto.getUser().setUsername(post.getUser().getActualUsername());
        }
        return dto;
    }
}
