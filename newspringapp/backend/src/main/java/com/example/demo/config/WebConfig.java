package com.example.demo.config;

import java.nio.file.Paths;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String uploadDirectory = Paths.get("uploads").toAbsolutePath().toString();
        System.out.println("Spring Boot serving static files from base directory: " + uploadDirectory); // For debugging

        registry.addResourceHandler("/uploads/profiles/**") // <--- NEW: Map the specific profile photo path
                .addResourceLocations("file:" + uploadDirectory + "/profiles/"); 

        registry.addResourceHandler("/uploads/posts/**") // <--- NEW: Map the specific posts path (if used)
                .addResourceLocations("file:" + uploadDirectory + "/posts/");
    }
}
