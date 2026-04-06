package com.meetlocalguide.platform.modules.tour.api.dto;

import com.meetlocalguide.platform.common.domain.CurrencyCode;
import java.math.BigDecimal;
import java.util.UUID;

public record TourSummaryResponse(
        UUID id,
        String slug,
        String title,
        String shortDescription,
        String city,
        int durationMinutes,
        BigDecimal basePriceAmount,
        CurrencyCode baseCurrency,
        BigDecimal averageRating,
        int totalReviews,
        String guideSlug,
        String guideDisplayName) {
}