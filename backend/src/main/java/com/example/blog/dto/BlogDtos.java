package com.example.blog.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.Instant;
import java.util.Set;

public class BlogDtos {
    public record BlogRequest(
            @NotBlank String title,
            @NotBlank @Size(max = 500) String description,
            @NotBlank String content,
            @NotBlank String category,
            String imageUrl,
            Set<String> tags
    ) {}

    public record BlogResponse(
            Long id,
            String title,
            String description,
            String content,
            String category,
            Set<String> tags,
            String imageUrl,
            UserResponse author,
            int likes,
            Set<Long> likedByUsers,
            long commentCount,
            Instant createdAt,
            Instant updatedAt
    ) {}
}
