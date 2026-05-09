package com.example.blog.controller;

import com.example.blog.dto.BlogDtos.BlogRequest;
import com.example.blog.dto.BlogDtos.BlogResponse;
import com.example.blog.service.BlogService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/blogs")
@RequiredArgsConstructor
public class BlogController {
    private final BlogService blogService;

    @GetMapping
    Page<BlogResponse> all(@RequestParam(required = false) String search,
                           @RequestParam(required = false) String category,
                           @PageableDefault(size = 9, sort = "createdAt") Pageable pageable) {
        return blogService.findAll(search, category, pageable);
    }

    @GetMapping("/my")
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    Page<BlogResponse> my(@PageableDefault(size = 50, sort = "createdAt") Pageable pageable,
                          Authentication authentication) {
        return blogService.findByAuthor(authentication.getName(), pageable);
    }

    @GetMapping("/{id}")
    BlogResponse one(@PathVariable Long id) {
        return blogService.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    BlogResponse create(@Valid @RequestBody BlogRequest request, Authentication authentication) {
        return blogService.create(request, authentication.getName());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    BlogResponse update(@PathVariable Long id, @Valid @RequestBody BlogRequest request, Authentication authentication) {
        return blogService.update(id, request, authentication.getName());
    }

    @PostMapping("/{id}/like")
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    BlogResponse like(@PathVariable Long id, Authentication authentication) {
        return blogService.like(id, authentication.getName());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    void delete(@PathVariable Long id, Authentication authentication) {
        blogService.delete(id, authentication.getName());
    }
}
