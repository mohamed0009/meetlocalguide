package com.meetlocalguide.platform.modules.review.api.dto;

import java.time.Instant;
import java.util.UUID;

public record ReviewResponse(
        UUID id,
        UUID bookingId,
        UUID tourId,
        String tourSlug,
        String tourTitle,
        UUID authorId,
        String authorDisplayName,
        int rating,
        String comment,
        String guideReply,
        Instant guideRepliedAt,
        boolean visible,
        Instant createdAt) {
}