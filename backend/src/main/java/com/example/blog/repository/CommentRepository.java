package com.example.blog.repository;

import com.example.blog.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByBlogIdOrderByCreatedAtDesc(Long blogId);
    long countByBlogId(Long blogId);
    @Transactional
    void deleteByBlogId(Long blogId);
    @Transactional
    void deleteByUserId(Long userId);
}
