package com.InventoryManagement.store.auth.dto;

import com.InventoryManagement.store.entity.User;

public class LoginResponse {
    private String token;
    private UserView user;

    public LoginResponse() {
    }

    public LoginResponse(String token, User entity) {
        this.token = token;
        this.user = UserView.from(entity); // do not mutate the managed entity
    }

    public String getToken() {
        return token;
    }

    public UserView getUser() {
        return user;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public void setUser(UserView user) {
        this.user = user;
    }

    public static class UserView {
        private Long id;
        private String username;
        private String email;
        private String role;
        private String password; // always null in responses

        public static UserView from(User u) {
            UserView v = new UserView();
            if (u != null) {
                v.id = u.getId();
                v.username = u.getUsername();
                v.email = u.getEmail();
                v.role = u.getRole();
                v.password = null; // never expose or mutate entity password
            }
            return v;
        }

        public Long getId() { return id; }
        public String getUsername() { return username; }
        public String getEmail() { return email; }
        public String getRole() { return role; }
        public String getPassword() { return password; }

        public void setId(Long id) { this.id = id; }
        public void setUsername(String username) { this.username = username; }
        public void setEmail(String email) { this.email = email; }
        public void setRole(String role) { this.role = role; }
        public void setPassword(String password) { this.password = password; }
    }
}