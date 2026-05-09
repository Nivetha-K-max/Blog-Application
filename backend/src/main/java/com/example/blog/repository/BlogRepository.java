package com.example.blog.repository;

import com.example.blog.entity.Blog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BlogRepository extends JpaRepository<Blog, Long> {
    Page<Blog> findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String title, String description, Pageable pageable);
    Page<Blog> findByCategoryIgnoreCase(String category, Pageable pageable);
    Page<Blog> findByAuthorId(Long authorId, Pageable pageable);
    List<Blog> findByAuthorId(Long authorId);
}
