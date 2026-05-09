package com.example.blog.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.Instant;

public class CommentDtos {
    public record CommentRequest(@NotNull Long blogId, @NotBlank String comment) {}
    public record CommentResponse(Long id, Long blogId, String comment, UserResponse user, Instant createdAt) {}
}
