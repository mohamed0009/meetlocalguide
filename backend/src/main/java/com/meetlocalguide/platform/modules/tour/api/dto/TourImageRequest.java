package com.meetlocalguide.platform.modules.tour.api.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record TourImageRequest(
        @NotBlank(message = "Image URL is required.") @Size(max = 500, message = "Image URL must be at most 500 characters.") String imageUrl,

        @Size(max = 255, message = "Alt text must be at most 255 characters.") String altText,

        @Min(value = 0, message = "Display order cannot be negative.") int displayOrder,

        boolean isPrimary) {
}