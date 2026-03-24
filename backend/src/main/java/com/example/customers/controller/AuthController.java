package com.example.customers.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final boolean authEnabled;

    public AuthController(@Value("${app.auth.enabled}") boolean authEnabled) {
        this.authEnabled = authEnabled;
    }

    @GetMapping("/status")
    public Map<String, Boolean> status() {
        return Map.of("authEnabled", authEnabled);
    }

    @GetMapping("/me")
    public Map<String, String> me(Principal principal) {
        if (principal == null) {
            return Map.of("username", "");
        }
        return Map.of("username", principal.getName());
    }
}
