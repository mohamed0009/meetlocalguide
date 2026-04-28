package com.meetlocalguide.platform.modules.auth.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record ResetPasswordRequest(
        @NotBlank(message = "Password reset token is required.") String token,
        @NotBlank(message = "Password is required.") @Size(min = 8, max = 72, message = "Password must be between 8 and 72 characters.") @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]).+$", message = "Password must include upper, lower, number, and special character.") String newPassword) {
}
