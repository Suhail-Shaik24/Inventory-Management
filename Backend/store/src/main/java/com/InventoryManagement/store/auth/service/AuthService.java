package com.InventoryManagement.store.auth.service;

import com.InventoryManagement.store.auth.dto.LoginRequest;
import com.InventoryManagement.store.auth.dto.LoginResponse;
import com.InventoryManagement.store.auth.dto.SignupRequest;

public interface AuthService {

    LoginResponse login(LoginRequest request);

    LoginResponse login(String username, String password);

    // Signup creates a new user and returns a LoginResponse (token + user) on success,
    // or null on failure (e.g. username already exists)
    LoginResponse signup(SignupRequest request);

    // Overload for params-based signup
    default LoginResponse signup(String username, String email, String password) {
        SignupRequest req = new SignupRequest();
        req.setUsername(username);
        req.setEmail(email);
        req.setPassword(password);
        return signup(req);
    }

    boolean isTokenValid(String token);

    String getUsernameForToken(String token);
}