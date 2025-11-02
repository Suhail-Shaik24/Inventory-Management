// Backend/store/src/main/java/com/InventoryManagement/store/auth/controller/AuthController.java
package com.InventoryManagement.store.auth.controller;

import com.InventoryManagement.store.auth.dto.LoginRequest;
import com.InventoryManagement.store.auth.dto.LoginResponse;
import com.InventoryManagement.store.auth.dto.SignupRequest;
import com.InventoryManagement.store.auth.service.AuthService;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    private void setTokenCookie(HttpServletResponse response, String token) {
        if (token == null) return;
        ResponseCookie cookie = ResponseCookie.from("token", token)
                .httpOnly(true)
                .secure(false)
                .path("/")
                .sameSite("Lax")
                .maxAge(Duration.ofDays(1))
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }

    // ----- Signup (token path) -----
    @PostMapping(path = "/token/signup", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<LoginResponse> signupToken(@RequestBody(required = false) SignupRequest request,
                                                     @RequestParam(value = "username", required = false) String username,
                                                     @RequestParam(value = "password", required = false) String password,
                                                     @RequestParam(value = "email", required = false) String email,
                                                     @RequestParam(value = "role", required = false) String role,
                                                     HttpServletResponse response) {
        if (request == null) {
            request = new SignupRequest();
            request.setUsername(username);
            request.setPassword(password);
            request.setEmail(email);
            request.setRole(role);
        }
        log.info("Signup request received for username='{}', email='{}'", request.getUsername(), request.getEmail());
        LoginResponse resp = authService.signup(request);
        if (resp == null) {
            log.warn("Signup failed (duplicate or invalid) for username='{}'", request.getUsername());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
        setTokenCookie(response, resp.getToken());
        log.info("Signup success for username='{}'", request.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED).body(resp);
    }

    // Alias path accepts JSON body or form params
    @PostMapping(path = "/signup", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<LoginResponse> signupAlias(@RequestBody(required = false) SignupRequest request,
                                                     @RequestParam(value = "username", required = false) String username,
                                                     @RequestParam(value = "password", required = false) String password,
                                                     @RequestParam(value = "email", required = false) String email,
                                                     @RequestParam(value = "role", required = false) String role,
                                                     HttpServletResponse response) {
        return signupToken(request, username, password, email, role, response);
    }

    // ----- Login (JSON + params, two base paths) -----
    @PostMapping(path = "/token/login", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<LoginResponse> loginJson(@RequestBody LoginRequest request, HttpServletResponse response) {
        log.info("Login request received for username/email='{}'", request.getUsername());
        LoginResponse resp = authService.login(request);
        if (resp == null) {
            log.warn("Login failed for username/email='{}'", request.getUsername());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        setTokenCookie(response, resp.getToken());
        log.info("Login success for username/email='{}'", request.getUsername());
        return ResponseEntity.ok(resp);
    }

    @PostMapping(path = "/token/login", params = {"username","password"}, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<LoginResponse> loginParams(@RequestParam String username, @RequestParam String password, HttpServletResponse response) {
        LoginResponse resp = authService.login(username, password);
        if (resp == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        setTokenCookie(response, resp.getToken());
        return ResponseEntity.ok(resp);
    }

    @PostMapping(path = "/login", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<LoginResponse> loginAlias(@RequestBody LoginRequest request, HttpServletResponse response) {
        return loginJson(request, response);
    }
}