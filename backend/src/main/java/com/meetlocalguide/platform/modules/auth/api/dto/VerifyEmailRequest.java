package com.meetlocalguide.platform.modules.auth.api.dto;

import jakarta.validation.constraints.NotBlank;

public record VerifyEmailRequest(
        @NotBlank(message = "Verification token is required.") String token) {
}
