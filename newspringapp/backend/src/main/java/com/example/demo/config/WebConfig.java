package com.example.demo.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {

        // ✅ Expose all files in /uploads/
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:D:/alumni portal/newspringapp/uploads/");

        // (Optional) Retain subfolder-specific mappings if needed
        registry.addResourceHandler("/uploads/members/**")
                .addResourceLocations("file:D:/alumni portal/newspringapp/uploads/members/");

        registry.addResourceHandler("/uploads/profile/**")
                .addResourceLocations("file:D:/alumni portal/newspringapp/uploads/profile/");
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/uploads/**")
                .allowedOrigins("http://localhost:3000")
                .allowedMethods("GET");
    }
}
