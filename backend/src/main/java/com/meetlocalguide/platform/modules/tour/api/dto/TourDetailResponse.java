package com.meetlocalguide.platform.modules.tour.api.dto;

import com.meetlocalguide.platform.common.domain.CurrencyCode;
import java.math.BigDecimal;
import java.util.List;
import java.util.Set;
import java.util.UUID;

public record TourDetailResponse(
        UUID id,
        String slug,
        String title,
        String shortDescription,
        String description,
        String city,
        String region,
        String country,
        String meetingPoint,
        BigDecimal latitude,
        BigDecimal longitude,
        int durationMinutes,
        int maxGroupSize,
        BigDecimal basePriceAmount,
        CurrencyCode baseCurrency,
        String status,
        boolean featured,
        BigDecimal averageRating,
        int totalReviews,
        Set<String> tags,
        String guideSlug,
        String guideDisplayName,
        List<TourImageView> images,
        List<TourTranslationView> translations) {
}