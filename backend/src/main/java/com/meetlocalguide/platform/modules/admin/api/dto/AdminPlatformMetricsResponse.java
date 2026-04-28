package com.meetlocalguide.platform.modules.admin.api.dto;

public record AdminPlatformMetricsResponse(
        long totalUsers,
        long activeUsers,
        long verifiedGuides,
        long totalGuides,
        long totalTours,
        long totalBookings) {
}
