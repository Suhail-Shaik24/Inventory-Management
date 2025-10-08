package com.InventoryManagement.store.controller;

import com.InventoryManagement.store.entity.User;
import com.InventoryManagement.store.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/auth")
public class LoginController {
    private static final Logger logger = LoggerFactory.getLogger(LoginController.class);
    @Autowired
    private UserRepository userRepository;

    @PostMapping("/login")
    public String login(@RequestParam String username, @RequestParam String password) {
        User user = userRepository.findByUsername(username).orElse(null);
        if (user != null && user.getPassword().equals(password)) {
            return "{\"success\": true, \"message\": \"Login successful\", \"role\": \"" + user.getRole() + "\"}";
        } else {
            return "{\"success\": false, \"message\": \"Invalid credentials\"}";
        }
    }

    @PostMapping("/signup")
    public String signup(@RequestParam String username, @RequestParam String email, @RequestParam String password) {
        logger.info("Signup attempt: username={}, email={}, password length={}", username, email, password.length());  // Debug log
        if (username == null || username.isEmpty() || email == null || email.isEmpty() || password == null || password.isEmpty()) {
            return "{\"success\": false, \"message\": \"All fields required\"}";
        }
        if (userRepository.findByUsername(username).isPresent()) {
            return "{\"success\": false, \"message\": \"Username already exists\"}";
        }
        User newUser = new User(username, email, password, "user");
        userRepository.save(newUser);
        return "{\"success\": true, \"message\": \"Signup successful. Please login.\"}";
    }
}