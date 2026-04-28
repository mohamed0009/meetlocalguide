package com.meetlocalguide.platform.modules.favorite.api.dto;

import com.meetlocalguide.platform.common.domain.CurrencyCode;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record FavoriteResponse(
        UUID favoriteId,
        UUID tourId,
        String tourSlug,
        String tourTitle,
        String tourShortDescription,
        String tourCity,
        int tourDurationMinutes,
        BigDecimal tourBasePriceAmount,
        CurrencyCode tourBaseCurrency,
        BigDecimal tourAverageRating,
        int tourTotalReviews,
        Instant savedAt) {
}
