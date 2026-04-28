package com.meetlocalguide.platform.modules.admin.api.dto;

import java.time.Instant;
import java.util.Set;
import java.util.UUID;

public record AdminUserSummaryResponse(
        UUID id,
        String email,
        String accountStatus,
        boolean emailVerified,
        Instant lastLoginAt,
        Set<String> roles) {
}
