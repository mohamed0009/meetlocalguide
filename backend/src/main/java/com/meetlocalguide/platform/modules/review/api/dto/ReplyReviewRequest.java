package com.meetlocalguide.platform.modules.review.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ReplyReviewRequest(
        @NotBlank(message = "Guide reply is required.") @Size(max = 2000, message = "Guide reply must be at most 2000 characters.") String guideReply) {
}