package com.example.demo.config;

import com.example.demo.service.admin.CustomAdminDetailsService;
import com.example.demo.service.alumni.CustomAlumniDetailsService;
import com.example.demo.service.student.CustomStudentDetailsService;
import com.example.demo.utils.JwtUtils;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Slf4j
@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private CustomAdminDetailsService customAdminDetailsService;

    @Autowired
    private CustomAlumniDetailsService customAlumniDetailsService;

    @Autowired
    private CustomStudentDetailsService customStudentDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");
        String token = null;
        String email = null;

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
            try {
                email = jwtUtils.getEmailFromToken(token);
            } catch (Exception e) {
                log.error("Invalid JWT token: {}", e.getMessage());
            }
        }

        if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = null;
            String uri = request.getRequestURI();

            try {
                if (uri.startsWith("/api/admin")) {
                    userDetails = customAdminDetailsService.loadUserByUsername(email);
                } else if (uri.startsWith("/api/alumni")) {
                    userDetails = customAlumniDetailsService.loadUserByUsername(email);
                } else if (uri.startsWith("/api/student")) {
                    userDetails = customStudentDetailsService.loadUserByUsername(email);
                }

                if (userDetails != null && jwtUtils.validateToken(token)) {
                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            } catch (Exception ex) {
                log.error("Authentication error: {}", ex.getMessage());
            }
        }

        filterChain.doFilter(request, response);
    }
}
