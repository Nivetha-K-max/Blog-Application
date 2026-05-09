package com.example.blog.config;

import com.example.blog.entity.Blog;
import com.example.blog.entity.Comment;
import com.example.blog.entity.Role;
import com.example.blog.entity.User;
import com.example.blog.repository.BlogRepository;
import com.example.blog.repository.CommentRepository;
import com.example.blog.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.Arrays;
import java.util.HashSet;

@Component
public class DataSeeder implements CommandLineRunner {
    private final UserRepository userRepository;
    private final BlogRepository blogRepository;
    private final CommentRepository commentRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UserRepository userRepository, BlogRepository blogRepository,
                      CommentRepository commentRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.blogRepository = blogRepository;
        this.commentRepository = commentRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // Note: this file relies on Lombok @Builder/@Getter/@Setter in entity classes.
    // If Lombok is enabled in your build, the setters/builder should be available.


    @Override
    public void run(String... args) {
        boolean hasUsers = userRepository.count() > 0;
        boolean hasBlogs = blogRepository.count() > 0;
        if (hasUsers && hasBlogs) return;

        User[] users = new User[6];

        if (!hasUsers) {
            User admin = new User();
            admin.setName("Admin User");
            admin.setEmail("admin@blog.com");
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(Role.ADMIN);
            admin.setCreatedAt(Instant.now());
            userRepository.save(admin);

            // nivi user
            User nivi = new User();
            nivi.setName("Nivi");
            nivi.setEmail("nivi@gmail.com");
            nivi.setUsername("nivi");
            nivi.setPassword(passwordEncoder.encode("nivi1627"));
            nivi.setRole(Role.USER);
            nivi.setCreatedAt(Instant.now());
            userRepository.save(nivi);

            String[] names = {"Alice Johnson", "Bob Smith", "Carol White", "David Brown", "Emma Davis"};
            String[] usernames = {"user1", "user2", "user3", "user4", "user5"};
            for (int i = 0; i < 5; i++) {
                User user = new User();
                user.setName(names[i]);
                user.setEmail(usernames[i] + "@blog.com");
                user.setUsername(usernames[i]);
                user.setPassword(passwordEncoder.encode("password123"));
                user.setRole(Role.USER);
                user.setCreatedAt(Instant.now());
                userRepository.save(user);
            }
        }

        // Select 6 users for authors (admin + nivi + 4 others)
        for (int i = 0; i < 6; i++) {
            users[i] = userRepository.findAll().stream().skip(i).findFirst().orElseThrow();
        }

        // Blog titles and content (keep arrays aligned by index)


        String[] titles = {
                "Getting Started with React.js",
                "Spring Boot Best Practices",
                "The Future of Web Development",
                "Cloud Computing Trends 2026",
                "DevOps Automation Guide",
                "Microservices Architecture",
                "Building Scalable Applications",
                "JavaScript Performance Tips",
                "Database Optimization Strategies",
                "REST API Design Patterns",
                "My Journey into Full-Stack Development",
                "Why I Love Spring Boot",
                "React Hooks Deep Dive"
        };

        String[] descriptions = {
                "Learn how to build interactive user interfaces with React.js",
                "Essential best practices for Spring Boot development",
                "Exploring the latest trends shaping web development",
                "Understanding cloud computing and its applications",
                "Automating your DevOps workflows efficiently",
                "Design and implement microservices architecture",
                "Building applications that scale with your business",
                "Optimize your JavaScript code for better performance",
                "Techniques to optimize database queries",
                "Learn RESTful API design patterns and principles",
                "A personal story of learning full-stack development from scratch",
                "Exploring what makes Spring Boot the go-to Java framework",
                "A deep dive into useState, useEffect, and custom hooks"
        };

        String[] contents = {
                "React.js is a JavaScript library for building user interfaces with reusable components. Learn about JSX, hooks, and state management.",
                "In this guide, we'll explore best practices for Spring Boot development including dependency injection, configuration, and testing.",
                "The web development landscape is constantly evolving. New frameworks, tools, and paradigms emerge regularly.",
                "Cloud computing continues to transform how businesses operate. From AWS to Azure, the options are vast.",
                "DevOps is about breaking down silos between development and operations teams. Automation is key.",
                "Microservices architecture allows you to build scalable applications by breaking them into smaller services.",
                "Scaling applications requires careful planning and implementation of caching, databases, and load balancing.",
                "JavaScript performance is crucial for user experience. Learn optimization techniques and profiling tools.",
                "Database optimization involves indexing, query planning, and understanding your data.",
                "RESTful APIs follow specific design patterns that make them predictable and easy to use.",
                "Starting from zero, I picked up HTML, CSS, JavaScript, then React and Spring Boot. Here's what I learned along the way.",
                "Spring Boot's auto-configuration, embedded server, and starter dependencies make backend development a joy.",
                "React hooks revolutionized how we write components. This post covers the most important hooks with real examples."
        };

        String[] categories = {"Technology", "Programming", "Cloud Computing", "React", "Spring Boot", "DevOps", "AI", "Travel"};
        String[] imageUrls = {
                // 0 - React.js
                "https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=800&h=500&fit=crop&auto=format",
                // 1 - Spring Boot
                "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=500&fit=crop&auto=format",
                // 2 - Future of Web Dev
                "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800&h=500&fit=crop&auto=format",
                // 3 - Cloud Computing
                "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=500&fit=crop&auto=format",
                // 4 - DevOps
                "https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=800&h=500&fit=crop&auto=format",
                // 5 - Microservices
                "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=500&fit=crop&auto=format",
                // 6 - Scalable Apps
                "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=500&fit=crop&auto=format",
                // 7 - JS Performance
                "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=800&h=500&fit=crop&auto=format",
                // 8 - Database Optimization
                "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&h=500&fit=crop&auto=format",
                // 9 - REST API
                "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=500&fit=crop&auto=format",
                // 10 - Nivi: Full-Stack Journey
                "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=500&fit=crop&auto=format",
                // 11 - Nivi: Why I Love Spring Boot
                "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=500&fit=crop&auto=format",
                // 12 - Nivi: React Hooks Deep Dive
                "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800&h=500&fit=crop&auto=format"
        };

        // Nivi's dedicated posts (indices 10-12)
        int[] niviPostIndices = {10, 11, 12};
        // users[1] is nivi (admin=0, nivi=1)
        User nivi = users[1];
        for (int idx : niviPostIndices) {
            Blog blog = new Blog();
            blog.setTitle(titles[idx]);
            blog.setDescription(descriptions[idx]);
            blog.setContent(contents[idx] + "\n\n" + contents[idx]);
            blog.setCategory(categories[idx % categories.length]);
            blog.setImageUrl(imageUrls[idx]);
            blog.setAuthor(nivi);
            blog.setTags(new HashSet<>(Arrays.asList(categories[idx % categories.length].toLowerCase(), "nivi", "personal")));
            blog.setCreatedAt(Instant.now().minusSeconds(86400L * (idx - 9)));
            blog.setUpdatedAt(blog.getCreatedAt());
            Blog savedBlog = blogRepository.save(blog);
            Comment comment = new Comment();
            comment.setComment("Love this post, Nivi! Very well explained.");
            comment.setBlog(savedBlog);
            comment.setUser(users[2]);
            comment.setCreatedAt(Instant.now().minusSeconds(3600));
            commentRepository.save(comment);
        }

        int maxSeeds = 10; // first 10 titles for other users
        int titleIdx = 0;
        for (int u = 0; u < 6 && titleIdx < maxSeeds; u++) {
            if (users[u].getEmail().equals("nivi@gmail.com")) continue; // nivi already seeded
            for (int i = 0; i < 2 && titleIdx < maxSeeds; i++) {
                int idx = titleIdx;
                Blog blog = new Blog();
                blog.setTitle(titles[idx]);
                blog.setDescription(descriptions[idx]);
                blog.setContent(contents[idx] + "\n\n" + contents[idx]);
                blog.setCategory(categories[idx % categories.length]);
                blog.setImageUrl(imageUrls[idx]);
                blog.setAuthor(users[u]);
                blog.setTags(new HashSet<>(Arrays.asList(categories[idx % categories.length].toLowerCase(), "tutorial")));
                blog.setCreatedAt(Instant.now().minusSeconds(86400L * (i + 1)));
                blog.setUpdatedAt(blog.getCreatedAt());
                Blog savedBlog = blogRepository.save(blog);
                Comment comment = new Comment();
                comment.setComment("Great article! Very informative and well-written.");
                comment.setBlog(savedBlog);
                comment.setUser(users[(idx + 1) % 6]);
                comment.setCreatedAt(Instant.now().minusSeconds(43200));
                commentRepository.save(comment);
                titleIdx++;
            }
        }
    }
}

