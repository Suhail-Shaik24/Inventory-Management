package com.InventoryManagement.store.auth.filter;

import com.InventoryManagement.store.auth.service.AuthService;
import com.InventoryManagement.store.entity.User;
import com.InventoryManagement.store.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.List;

@Component
public class TokenFilter extends OncePerRequestFilter {

    private final AuthService authService;
    private final UserRepository userRepository;

    public TokenFilter(AuthService authService, UserRepository userRepository) {
        this.authService = authService;
        this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        String path = request.getRequestURI();

        // Skip auth endpoints and preflight; let SecurityConfig handle access
        if (path.startsWith("/api/auth/") || "OPTIONS".equalsIgnoreCase(request.getMethod())) {
            chain.doFilter(request, response);
            return;
        }

        String token = null;
        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            token = header.substring(7);
        } else if (request.getCookies() != null) {
            for (Cookie c : request.getCookies()) {
                if ("token".equals(c.getName())) {
                    token = c.getValue();
                    break;
                }
            }
        }

        if (token != null && authService.isTokenValid(token)) {
            String username = authService.getUsernameForToken(token);
            List<SimpleGrantedAuthority> authorities = Collections.emptyList();
            if (username != null) {
                User user = userRepository.findByUsername(username).orElse(null);
                if (user != null && user.getRole() != null) {
                    String role = "ROLE_" + user.getRole().toUpperCase();
                    authorities = List.of(new SimpleGrantedAuthority(role));
                }
            }
            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(username, null, authorities);
            authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }

        // Do not short-circuit unauthorized here; allow Spring Security to decide
        chain.doFilter(request, response);
    }
}