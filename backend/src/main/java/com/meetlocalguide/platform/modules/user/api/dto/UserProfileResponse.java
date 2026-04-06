package com.meetlocalguide.platform.modules.user.api.dto;

import com.meetlocalguide.platform.common.domain.CurrencyCode;
import com.meetlocalguide.platform.common.domain.SupportedLocale;
import java.time.LocalDate;
import java.util.UUID;

public record UserProfileResponse(
        UUID userId,
        String email,
        String accountStatus,
        String displayName,
        String avatarUrl,
        String phoneNumber,
        String nationality,
        SupportedLocale preferredLanguage,
        CurrencyCode preferredCurrency,
        String timezone,
        String about,
        LocalDate dateOfBirth) {
}