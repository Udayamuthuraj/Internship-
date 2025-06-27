package com.example.demo.service.alumni;

import com.example.demo.model.alumni.AlumniPost;
import com.example.demo.repository.alumni.AlumniPostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AlumniPostService {

    @Autowired
    private AlumniPostRepository postRepository;

    public List<AlumniPost> getPostsByUserId(Long userId) {
        return postRepository.findByUserId(userId);
    }

    public AlumniPost createPost(AlumniPost post) {
        post.setCreatedAt(java.time.LocalDateTime.now());
        return postRepository.save(post);
    }
}
