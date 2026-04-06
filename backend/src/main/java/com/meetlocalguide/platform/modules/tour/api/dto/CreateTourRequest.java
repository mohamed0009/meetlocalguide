package com.meetlocalguide.platform.modules.tour.api.dto;

import com.meetlocalguide.platform.common.domain.CurrencyCode;
import com.meetlocalguide.platform.modules.tour.domain.TourStatus;
import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.util.List;
import java.util.Set;

public record CreateTourRequest(
        @NotBlank(message = "Tour slug is required.") @Size(max = 180, message = "Tour slug must be at most 180 characters.") String slug,

        @NotBlank(message = "Tour title is required.") @Size(max = 200, message = "Tour title must be at most 200 characters.") String title,

        @Size(max = 280, message = "Short description must be at most 280 characters.") String shortDescription,

        @NotBlank(message = "Tour description is required.") @Size(max = 8000, message = "Tour description must be at most 8000 characters.") String description,

        @NotBlank(message = "Tour city is required.") @Size(max = 120, message = "Tour city must be at most 120 characters.") String city,

        @Size(max = 120, message = "Tour region must be at most 120 characters.") String region,

        @NotBlank(message = "Tour country is required.") @Size(max = 120, message = "Tour country must be at most 120 characters.") String country,

        @Size(max = 255, message = "Meeting point must be at most 255 characters.") String meetingPoint,

        BigDecimal latitude,
        BigDecimal longitude,

        @Min(value = 30, message = "Tour duration must be at least 30 minutes.") int durationMinutes,

        @Min(value = 1, message = "Maximum group size must be at least 1.") int maxGroupSize,

        @NotNull(message = "Tour base price is required.") @DecimalMin(value = "0.0", message = "Base price must be greater or equal to 0.") BigDecimal basePriceAmount,

        @NotNull(message = "Tour base currency is required.") CurrencyCode baseCurrency,

        TourStatus status,
        Boolean featured,
        Set<String> tags,

        @Valid List<TourImageRequest> images,

        @Valid List<TourTranslationRequest> translations) {
}