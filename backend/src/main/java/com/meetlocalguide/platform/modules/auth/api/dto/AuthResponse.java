package com.meetlocalguide.platform.modules.auth.api.dto;

public record AuthResponse(
        String tokenType,
        String accessToken,
        long accessTokenExpiresInSeconds,
        String refreshToken,
        AuthUserView user) {
}