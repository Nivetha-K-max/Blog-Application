package com.example.blog.service;

import com.example.blog.dto.CommentDtos.CommentRequest;
import com.example.blog.dto.CommentDtos.CommentResponse;
import com.example.blog.dto.UserResponse;
import com.example.blog.entity.Blog;
import com.example.blog.entity.Comment;
import com.example.blog.entity.Role;
import com.example.blog.entity.User;
import com.example.blog.exception.ApiException;
import com.example.blog.repository.BlogRepository;
import com.example.blog.repository.CommentRepository;
import com.example.blog.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentService {
    private final CommentRepository commentRepository;
    private final BlogRepository blogRepository;
    private final UserRepository userRepository;

    public List<CommentResponse> forBlog(Long blogId) {
        return commentRepository.findByBlogIdOrderByCreatedAtDesc(blogId).stream().map(this::toResponse).toList();
    }

    public CommentResponse add(CommentRequest request, String username) {
        Blog blog = blogRepository.findById(request.blogId()).orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Blog not found"));
        User user = getUser(username);
        Comment comment = new Comment();
        comment.setBlog(blog);
        comment.setUser(user);
        comment.setComment(request.comment());
        return toResponse(commentRepository.save(comment));
    }

    public CommentResponse update(Long id, CommentRequest request, String username) {
        Comment comment = getComment(id);
        ensureOwnerOrAdmin(comment, username);
        comment.setComment(request.comment());
        return toResponse(commentRepository.save(comment));
    }

    public void delete(Long id, String username) {
        Comment comment = getComment(id);
        ensureOwnerOrAdmin(comment, username);
        commentRepository.delete(comment);
    }

    private Comment getComment(Long id) {
        return commentRepository.findById(id).orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Comment not found"));
    }

    private User getUser(String username) {
        return userRepository.findByUsername(username).orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found"));
    }

    private void ensureOwnerOrAdmin(Comment comment, String username) {
        User user = getUser(username);
        if (!comment.getUser().getId().equals(user.getId()) && user.getRole() != Role.ADMIN) {
            throw new ApiException(HttpStatus.FORBIDDEN, "You are not allowed to modify this comment");
        }
    }

    private CommentResponse toResponse(Comment comment) {
        return new CommentResponse(comment.getId(), comment.getBlog().getId(), comment.getComment(), UserResponse.from(comment.getUser()), comment.getCreatedAt());
    }
}
