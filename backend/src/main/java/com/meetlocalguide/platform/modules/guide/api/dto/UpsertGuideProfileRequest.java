package com.meetlocalguide.platform.modules.guide.api.dto;

import com.meetlocalguide.platform.common.domain.SupportedLocale;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.util.Set;

public record UpsertGuideProfileRequest(
        @NotBlank(message = "Guide slug is required.") @Size(max = 180, message = "Guide slug must be at most 180 characters.") String slug,

        @NotBlank(message = "Guide bio is required.") @Size(max = 4000, message = "Guide bio must be at most 4000 characters.") String bio,

        @Min(value = 0, message = "Years of experience cannot be negative.") int yearsExperience,

        @NotBlank(message = "Guide city is required.") @Size(max = 120, message = "Guide city must be at most 120 characters.") String city,

        @NotBlank(message = "Guide country is required.") @Size(max = 120, message = "Guide country must be at most 120 characters.") String country,

        @DecimalMin(value = "0.0", message = "Hourly rate must be greater or equal to 0.") BigDecimal hourlyRateAmount,

        @Size(max = 500, message = "Availability must be at most 500 characters.") String availability,

        @NotEmpty(message = "At least one guide language is required.") Set<SupportedLocale> languages) {
}