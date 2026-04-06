package com.meetlocalguide.platform.modules.auth.api.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank(message = "Email is required.") @Email(message = "Email format is invalid.") @Size(max = 320, message = "Email must be at most 320 characters.") String email,

        @NotBlank(message = "Password is required.") @Size(min = 8, max = 72, message = "Password must be between 8 and 72 characters.") @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]).+$", message = "Password must include upper, lower, number, and special character.") String password,

        @NotBlank(message = "Display name is required.") @Size(min = 2, max = 120, message = "Display name must be between 2 and 120 characters.") String displayName) {
}