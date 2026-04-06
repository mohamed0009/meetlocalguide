package com.meetlocalguide.platform.modules.tour.api.dto;

import com.meetlocalguide.platform.common.domain.SupportedLocale;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record TourTranslationRequest(
        @NotNull(message = "Translation locale is required.") SupportedLocale locale,

        @NotBlank(message = "Translated title is required.") @Size(max = 200, message = "Translated title must be at most 200 characters.") String title,

        @NotBlank(message = "Translated description is required.") @Size(max = 8000, message = "Translated description must be at most 8000 characters.") String description) {
}