package com.pulsefit.backend.controller;

import org.springframework.web.bind.annotation.*;
import com.pulsefit.backend.security.JwtUtil;
import com.pulsefit.backend.model.User;
import com.pulsefit.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import java.util.Map;
import java.util.HashMap;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public static class AuthRequest {
        private String username;
        private String password;
        private String name;
        private String email;
        private String phone;
        private String role;

        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }
        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@RequestBody AuthRequest request) {
        Map<String, String> response = new HashMap<>();
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            response.put("message", "Username already exists!");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
        User newUser = new User(
            request.getUsername(), 
            passwordEncoder.encode(request.getPassword()),
            request.getName(),
            request.getEmail(),
            request.getPhone(),
            request.getRole()
        );
        userRepository.save(newUser);
        response.put("message", "User registered successfully!");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody AuthRequest creds) {
        Optional<User> optionalUser = userRepository.findByUsername(creds.getUsername());
        
        if (optionalUser.isPresent() && passwordEncoder.matches(creds.getPassword(), optionalUser.get().getPassword())) {
            User user = optionalUser.get();
            String token = jwtUtil.generateToken(user.getUsername());
            Map<String, String> response = new HashMap<>();
            response.put("token", token);
            response.put("role", user.getRole());
            response.put("name", user.getName());
            response.put("username", user.getUsername());
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @GetMapping("/hello")
    public String hello() {
        return "Hello from backend! Authentication was successful.";
    }
}
