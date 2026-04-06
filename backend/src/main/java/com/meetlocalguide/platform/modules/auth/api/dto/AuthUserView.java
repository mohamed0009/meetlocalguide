package com.meetlocalguide.platform.modules.auth.api.dto;

import java.util.List;
import java.util.UUID;

public record AuthUserView(
        UUID id,
        String email,
        String accountStatus,
        List<String> roles) {
}