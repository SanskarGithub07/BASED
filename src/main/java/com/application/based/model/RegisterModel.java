package com.application.based.model;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.Set;

@Data
public class RegisterModel {
    @NotBlank(message = "Username is required")
    private String username;

    @Email(message = "Invalid email format")
    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "Password is required")
    private String password;
    @NotBlank(message = "Matching password is required")
    private String matchingPassword;

    private String profilePicture;
    private String status;
    private Boolean enabled;
    private Set<String> roles; // Role names instead of Role entities
}

