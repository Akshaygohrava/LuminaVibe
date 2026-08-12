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
import com.luminavibe.entities.TargetType;
import com.luminavibe.entities.Comment;
import com.luminavibe.dtos.CommentDto;
import com.luminavibe.repositories.LikeRepository;
import com.luminavibe.repositories.CommentRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

@Service
public class PostServiceImpl implements PostService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private LikeRepository likeRepository;

    @Autowired
    private CommentRepository commentRepository;

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

    @Override
    public PostDto updatePost(Integer userId, Integer postId, String content, String location) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found"));
        if (!post.getUser().getUserId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not authorized to update this post");
        }
        post.setContent(content);
        post.setLocation(location);
        Post updated = postRepository.save(post);
        return convertToDto(updated);
    }

    @Override
    public void deletePost(Integer userId, Integer postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found"));
        if (!post.getUser().getUserId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not authorized to delete this post");
        }
        postRepository.delete(post);
    }

    private PostDto convertToDto(Post post) {
        if (post == null) return null;
        PostDto dto = modelMapper.map(post, PostDto.class);
        if (dto.getUser() != null && post.getUser() != null) {
            dto.getUser().setUsername(post.getUser().getActualUsername());
        }

        // Populate likes count
        int likesCount = likeRepository.countByTargetTypeAndTargetId(TargetType.post, post.getPostId());
        dto.setLikesCount(likesCount);

        // Populate isLiked
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof User) {
            User currentUser = (User) auth.getPrincipal();
            boolean isLiked = likeRepository.existsByUserUserIdAndTargetTypeAndTargetId(currentUser.getUserId(), TargetType.post, post.getPostId());
            dto.setIsLiked(isLiked);
        } else {
            dto.setIsLiked(false);
        }

        // Populate comments (only top level, which recursively contain replies)
        List<Comment> topLevelComments = commentRepository.findByPostPostIdAndParentCommentIsNullOrderByCreatedAtAsc(post.getPostId());
        List<CommentDto> commentDtos = topLevelComments.stream()
                .map(this::convertCommentToDto)
                .collect(Collectors.toList());
        dto.setComments(commentDtos);

        return dto;
    }

    private CommentDto convertCommentToDto(Comment comment) {
        if (comment == null) return null;
        CommentDto dto = new CommentDto();
        dto.setCommentId(comment.getCommentId());
        dto.setPostId(comment.getPost().getPostId());
        dto.setUserId(comment.getUser().getUserId());
        dto.setUsername(comment.getUser().getActualUsername());
        dto.setUserAvatar(comment.getUser().getProfilePictureUrl());
        dto.setParentCommentId(comment.getParentComment() != null ? comment.getParentComment().getCommentId() : null);
        dto.setContent(comment.getContent());
        dto.setCreatedAt(comment.getCreatedAt());

        // Recursive population of nested replies
        List<Comment> replies = commentRepository.findByParentCommentCommentIdOrderByCreatedAtAsc(comment.getCommentId());
        List<CommentDto> replyDtos = replies.stream()
                .map(this::convertCommentToDto)
                .collect(Collectors.toList());
        dto.setReplies(replyDtos);

        return dto;
    }
}
