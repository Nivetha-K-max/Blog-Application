package com.example.blog.dto;

import com.example.blog.entity.Role;
import com.example.blog.entity.User;

import java.time.Instant;

public record UserResponse(Long id, String name, String email, String username, Role role, boolean active, Instant createdAt) {
    public static UserResponse from(User user) {
        return new UserResponse(user.getId(), user.getName(), user.getEmail(), user.getUsername(), user.getRole(), user.isActive(), user.getCreatedAt());
    }
}
