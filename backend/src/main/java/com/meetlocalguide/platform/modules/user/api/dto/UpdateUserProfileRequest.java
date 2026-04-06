package com.meetlocalguide.platform.modules.user.api.dto;

import com.meetlocalguide.platform.common.domain.CurrencyCode;
import com.meetlocalguide.platform.common.domain.SupportedLocale;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public record UpdateUserProfileRequest(
        @Size(min = 2, max = 120, message = "Display name must be between 2 and 120 characters.") String displayName,

        @Size(max = 500, message = "Avatar URL must be at most 500 characters.") String avatarUrl,

        @Size(max = 32, message = "Phone number must be at most 32 characters.") String phoneNumber,

        @Size(max = 120, message = "Nationality must be at most 120 characters.") String nationality,

        SupportedLocale preferredLanguage,
        CurrencyCode preferredCurrency,

        @Size(max = 64, message = "Timezone must be at most 64 characters.") String timezone,

        @Size(max = 1000, message = "About must be at most 1000 characters.") String about,

        LocalDate dateOfBirth) {
}