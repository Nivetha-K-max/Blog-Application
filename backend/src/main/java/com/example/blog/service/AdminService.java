package com.example.blog.service;

import com.example.blog.dto.UserResponse;
import com.example.blog.entity.Blog;
import com.example.blog.entity.User;
import com.example.blog.exception.ApiException;
import com.example.blog.repository.BlogRepository;
import com.example.blog.repository.CommentRepository;
import com.example.blog.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AdminService {
    private final UserRepository userRepository;
    private final BlogRepository blogRepository;
    private final CommentRepository commentRepository;

    public List<UserResponse> users() {
        return userRepository.findAll().stream().map(UserResponse::from).toList();
    }

    @Transactional
    public void deleteUser(Long id) {
        // Delete comments by this user
        commentRepository.deleteByUserId(id);
        // Delete each blog's comments then the blog itself
        List<Blog> blogs = blogRepository.findByAuthorId(id);
        for (Blog blog : blogs) {
            commentRepository.deleteByBlogId(blog.getId());
        }
        blogRepository.deleteAll(blogs);
        userRepository.deleteById(id);
    }

    @Transactional
    public UserResponse toggleActive(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found"));
        user.setActive(!user.isActive());
        return UserResponse.from(userRepository.save(user));
    }

    public Map<String, Long> stats() {
        return Map.of(
                "users", userRepository.count(),
                "blogs", blogRepository.count(),
                "comments", commentRepository.count());
    }
}
