package com.luminavibe.controllers;

import com.luminavibe.dtos.PostDto;
import com.luminavibe.entities.Bookmark;
import com.luminavibe.entities.Post;
import com.luminavibe.entities.User;
import com.luminavibe.repositories.BookmarkRepository;
import com.luminavibe.repositories.PostRepository;
import com.luminavibe.services.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/bookmarks")
@CrossOrigin
public class BookmarkController {

    @Autowired
    private BookmarkRepository bookmarkRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private PostService postService;

    @PostMapping("/toggle/{postId}")
    public ResponseEntity<Map<String, Object>> toggleBookmark(@PathVariable("postId") Integer postId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) auth.getPrincipal();

        Optional<Bookmark> existing = bookmarkRepository.findByUserUserIdAndPostPostId(user.getUserId(), postId);
        boolean bookmarked;
        if (existing.isPresent()) {
            bookmarkRepository.delete(existing.get());
            bookmarked = false;
        } else {
            Post post = postRepository.findById(postId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found"));
            Bookmark bookmark = new Bookmark();
            bookmark.setUser(user);
            bookmark.setPost(post);
            bookmarkRepository.save(bookmark);
            bookmarked = true;
        }

        return ResponseEntity.ok(Map.of("bookmarked", bookmarked));
    }

    @GetMapping
    public ResponseEntity<List<PostDto>> getBookmarkedPosts() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) auth.getPrincipal();

        List<Bookmark> bookmarks = bookmarkRepository.findByUserUserIdOrderByCreatedAtDesc(user.getUserId());
        List<PostDto> posts = bookmarks.stream()
                .map(b -> postService.convertToDto(b.getPost()))
                .collect(Collectors.toList());

        return ResponseEntity.ok(posts);
    }
}
