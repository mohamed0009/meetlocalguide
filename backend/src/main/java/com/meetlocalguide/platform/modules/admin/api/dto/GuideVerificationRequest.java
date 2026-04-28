package com.meetlocalguide.platform.modules.admin.api.dto;

import com.meetlocalguide.platform.modules.guide.domain.GuideVerificationStatus;
import jakarta.validation.constraints.NotNull;

public record GuideVerificationRequest(
        @NotNull(message = "Guide verification status is required.") GuideVerificationStatus status) {
}
