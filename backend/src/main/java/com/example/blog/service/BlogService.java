package com.example.blog.service;

import com.example.blog.dto.BlogDtos.BlogRequest;
import com.example.blog.dto.BlogDtos.BlogResponse;
import com.example.blog.dto.UserResponse;
import com.example.blog.entity.Blog;
import com.example.blog.entity.Role;
import com.example.blog.entity.User;
import com.example.blog.exception.ApiException;
import com.example.blog.repository.BlogRepository;
import com.example.blog.repository.CommentRepository;
import com.example.blog.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.HashSet;

@Service
@RequiredArgsConstructor
public class BlogService {
    private final BlogRepository blogRepository;
    private final UserRepository userRepository;
    private final CommentRepository commentRepository;

    public Page<BlogResponse> findAll(String search, String category, Pageable pageable) {
        Page<Blog> page;
        if (search != null && !search.isBlank()) {
            page = blogRepository.findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(search, search, pageable);
        } else if (category != null && !category.isBlank()) {
            page = blogRepository.findByCategoryIgnoreCase(category, pageable);
        } else {
            page = blogRepository.findAll(pageable);
        }
        return page.map(this::toResponse);
    }

    public Page<BlogResponse> findByAuthor(String username, Pageable pageable) {
        User user = getUser(username);
        return blogRepository.findByAuthorId(user.getId(), pageable).map(this::toResponse);
    }

    public BlogResponse findById(Long id) {
        return toResponse(getBlog(id));
    }

    public BlogResponse create(BlogRequest request, String username) {
        User author = getUser(username);
        Blog blog = new Blog();
        apply(request, blog);
        blog.setAuthor(author);
        return toResponse(blogRepository.save(blog));
    }

    public BlogResponse update(Long id, BlogRequest request, String username) {
        Blog blog = getBlog(id);
        ensureOwnerOrAdmin(blog, username);
        apply(request, blog);
        return toResponse(blogRepository.save(blog));
    }

    public void delete(Long id, String username) {
        Blog blog = getBlog(id);
        ensureOwnerOrAdmin(blog, username);
        commentRepository.deleteByBlogId(id);
        blogRepository.delete(blog);
    }

    public BlogResponse like(Long id, String username) {
        Blog blog = getBlog(id);
        User user = getUser(username);
        if (blog.getLikedByUsers().contains(user.getId())) {
            blog.getLikedByUsers().remove(user.getId());
        } else {
            blog.getLikedByUsers().add(user.getId());
        }
        return toResponse(blogRepository.save(blog));
    }

    private void apply(BlogRequest request, Blog blog) {
        blog.setTitle(request.title());
        blog.setDescription(request.description());
        blog.setContent(request.content());
        blog.setCategory(request.category());
        blog.setImageUrl(request.imageUrl());
        blog.setTags(request.tags() == null ? new HashSet<>() : new HashSet<>(request.tags()));
    }

    private Blog getBlog(Long id) {
        return blogRepository.findById(id).orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Blog not found"));
    }

    private User getUser(String username) {
        return userRepository.findByUsername(username).orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found"));
    }

    private void ensureOwnerOrAdmin(Blog blog, String username) {
        User user = getUser(username);
        if (!blog.getAuthor().getId().equals(user.getId()) && user.getRole() != Role.ADMIN) {
            throw new ApiException(HttpStatus.FORBIDDEN, "You are not allowed to modify this blog");
        }
    }

    private BlogResponse toResponse(Blog blog) {
        return new BlogResponse(
                blog.getId(),
                blog.getTitle(),
                blog.getDescription(),
                blog.getContent(),
                blog.getCategory(),
                blog.getTags(),
                blog.getImageUrl(),
                UserResponse.from(blog.getAuthor()),
                blog.getLikedByUsers().size(),
                blog.getLikedByUsers(),
                commentRepository.countByBlogId(blog.getId()),
                blog.getCreatedAt(),
                blog.getUpdatedAt());
    }
}
