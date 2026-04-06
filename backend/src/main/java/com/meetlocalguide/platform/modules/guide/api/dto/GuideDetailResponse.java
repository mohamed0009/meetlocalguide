package com.meetlocalguide.platform.modules.guide.api.dto;

import com.meetlocalguide.platform.common.domain.SupportedLocale;
import java.math.BigDecimal;
import java.util.Set;
import java.util.UUID;

public record GuideDetailResponse(
        UUID id,
        UUID userId,
        String slug,
        String displayName,
        String email,
        String bio,
        int yearsExperience,
        String city,
        String country,
        String verificationStatus,
        BigDecimal hourlyRateAmount,
        BigDecimal averageRating,
        int totalReviews,
        Set<SupportedLocale> languages) {
}