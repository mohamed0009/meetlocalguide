package com.meetlocalguide.platform.modules.tour.api.dto;

import com.meetlocalguide.platform.common.domain.SupportedLocale;
import java.util.UUID;

public record TourTranslationView(
        UUID id,
        SupportedLocale locale,
        String title,
        String description) {
}