package com.meetlocalguide.platform.modules.guide.api.dto;

import com.meetlocalguide.platform.common.domain.SupportedLocale;
import java.math.BigDecimal;
import java.util.Set;
import java.util.UUID;

public record GuideSummaryResponse(
        UUID id,
        String slug,
        String displayName,
        String city,
        String country,
        String verificationStatus,
        BigDecimal averageRating,
        int totalReviews,
        Set<SupportedLocale> languages) {
}