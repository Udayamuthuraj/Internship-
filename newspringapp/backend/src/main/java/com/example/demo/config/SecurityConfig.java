package com.example.demo.config;

import com.example.demo.service.admin.CustomAdminDetailsService;
import com.example.demo.service.alumni.CustomAlumniDetailsService;
import com.example.demo.service.student.CustomStudentDetailsService;
import com.example.demo.config.JwtAuthFilter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;

import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthFilter jwtAuthFilter;

    @Autowired
    private CustomAdminDetailsService customAdminDetailsService;

    @Autowired
    private CustomAlumniDetailsService customAlumniDetailsService;

    @Autowired
    private CustomStudentDetailsService customStudentDetailsService;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors()
            .and()
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(
                    // ✅ Admin Auth & Dashboard
                    "/api/admin/auth/**",
                    "/api/admin/email/**",
                    "/api/admin/password/**",
                    "/api/admin/statistics",
                    "/api/admin/broadcast/**",
                    "/api/admin/members/**",
                    "/api/admin/profile/**",
                    "/api/admin/videos/**",
                    "/api/admin/gallery/**",
                    "/api/admin/dashboard/**",

                    // ✅ Alumni Auth
                    "/api/alumni/auth/**",
                    "/api/alumni/email/**",
                    "/api/alumni/password/**",

                    // ✅ Student Auth
                    "/api/student/auth/**",
                    "/api/student/email/**",
                    "/api/student/password/**",

                    // ✅ Feedback
                    "/api/feedback/submit",
                    "/api/feedback/all",
                    "/api/feedback/{id}/mark-replied",
                    "/api/admin/email/reply-feedback",

                    // ✅ Events & Registration
                    "/api/events/upload",
                    "/api/events",
                    "/api/events/**",
                    "/api/register-event",
                    "/api/payment-screenshot/**",
                    "/api/events/upcoming-titles",
                    "/api/view-registrations/**",

                    // ✅ Static content
                    "/uploads/**"
                ).permitAll()
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:3000")); // Update for prod
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
