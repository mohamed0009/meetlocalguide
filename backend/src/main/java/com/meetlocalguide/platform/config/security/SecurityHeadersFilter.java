package com.meetlocalguide.platform.config.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.web.filter.OncePerRequestFilter;

public class SecurityHeadersFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        response.setHeader("X-Content-Type-Options", "nosniff");
        response.setHeader("X-Frame-Options", "DENY");
        response.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
        response.setHeader("Permissions-Policy", "geolocation=(), microphone=(), camera=()");
        response.setHeader("Content-Security-Policy",
                "default-src 'self'; img-src 'self' https: data:; object-src 'none'; frame-ancestors 'none'; base-uri 'self';");
        response.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
        filterChain.doFilter(request, response);
    }
}
