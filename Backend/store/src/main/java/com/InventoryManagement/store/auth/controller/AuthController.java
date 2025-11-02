package com.InventoryManagement.store.auth.controller;

import com.InventoryManagement.store.auth.dto.LoginResponse;
import com.InventoryManagement.store.auth.service.AuthService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth/token")
public class AuthFormController {

    private final AuthService authService;

    public AuthFormController(AuthService authService) {
        this.authService = authService;
    }

    // POST /api/auth/token/login-form
    @PostMapping(
        path = "/login-form",
        consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE,
        produces = MediaType.APPLICATION_JSON_VALUE
    )
    public LoginResponse loginForm(@RequestParam("username") String username,
                                   @RequestParam("password") String password) {
        // Delegate to your existing auth logic
        return authService.login(username, password);
    }
}