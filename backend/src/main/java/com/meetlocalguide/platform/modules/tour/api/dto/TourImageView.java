package com.meetlocalguide.platform.modules.tour.api.dto;

import java.util.UUID;

public record TourImageView(
        UUID id,
        String imageUrl,
        String altText,
        int displayOrder,
        boolean isPrimary) {
}