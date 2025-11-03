// Backend/store/src/main/java/com/InventoryManagement/store/auth/service/AuthServiceImpl.java
package com.InventoryManagement.store.auth.service;

import com.InventoryManagement.store.auth.dto.LoginRequest;
import com.InventoryManagement.store.auth.dto.LoginResponse;
import com.InventoryManagement.store.auth.dto.SignupRequest;
import com.InventoryManagement.store.auth.Util.JwtUtil;
import com.InventoryManagement.store.entity.User;
import com.InventoryManagement.store.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    public AuthServiceImpl(UserRepository userRepository, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    @Transactional(readOnly = true)
    @Override
    public LoginResponse login(LoginRequest request) {
        if (request == null || request.getUsername() == null || request.getPassword() == null) return null;
        // Support login by username or email
        User user = userRepository.findByUsername(request.getUsername())
                .or(() -> userRepository.findByEmail(request.getUsername()))
                .orElse(null);
        if (user == null) return null;
        String stored = user.getPassword();
        if (stored == null || !stored.equals(request.getPassword())) return null;
        String token = jwtUtil.generateToken(user.getUsername());
        return new LoginResponse(token, user);
    }

    @Transactional(readOnly = true)
    @Override
    public LoginResponse login(String username, String password) {
        LoginRequest req = new LoginRequest();
        req.setUsername(username);
        req.setPassword(password);
        return login(req);
    }

    @Transactional
    @Override
    public LoginResponse signup(SignupRequest request) {
        if (request == null || request.getUsername() == null || request.getPassword() == null) return null;
        // Block duplicates by username or email
        if (userRepository.findByUsername(request.getUsername()).isPresent()) return null;
        if (request.getEmail() != null && userRepository.findByEmail(request.getEmail()).isPresent()) return null;
        String role = canonicalRole(request.getRole());
        User newUser = new User(request.getUsername(), request.getEmail(), request.getPassword(), role);
        User saved = userRepository.saveAndFlush(newUser);
        String token = jwtUtil.generateToken(saved.getUsername());
        return new LoginResponse(token, saved);
    }

    // Persist uppercase role names; accept legacy/variant inputs.
    private String canonicalRole(String role) {
        if (role == null || role.isBlank()) return "MAKER";
        String r = role.trim().toUpperCase();
        return switch (r) {
            case "MAKER", "CHECKER", "MANAGER", "USER" -> r;
            case "ADMIN" -> "MANAGER"; // legacy admin maps to MANAGER
            default -> "USER";
        };
    }

    @Override
    public boolean isTokenValid(String token) {
        return jwtUtil.validateToken(token);
    }

    @Override
    public String getUsernameForToken(String token) {
        return jwtUtil.extractUsername(token);
    }
}