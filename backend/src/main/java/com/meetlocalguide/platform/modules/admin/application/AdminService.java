package com.meetlocalguide.platform.modules.admin.application;

import com.meetlocalguide.platform.common.exception.AppException;
import com.meetlocalguide.platform.modules.admin.api.dto.AdminPlatformMetricsResponse;
import com.meetlocalguide.platform.modules.admin.api.dto.AdminUserSummaryResponse;
import com.meetlocalguide.platform.modules.guide.api.dto.GuideDetailResponse;
import com.meetlocalguide.platform.modules.guide.application.GuideProfileService;
import com.meetlocalguide.platform.modules.guide.domain.GuideProfile;
import com.meetlocalguide.platform.modules.guide.domain.GuideVerificationStatus;
import com.meetlocalguide.platform.modules.guide.infrastructure.GuideProfileRepository;
import com.meetlocalguide.platform.modules.booking.infrastructure.BookingRepository;
import com.meetlocalguide.platform.modules.tour.infrastructure.TourRepository;
import com.meetlocalguide.platform.modules.user.domain.AccountStatus;
import com.meetlocalguide.platform.modules.user.domain.UserAccount;
import com.meetlocalguide.platform.modules.user.infrastructure.UserAccountRepository;
import java.util.Set;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserAccountRepository userAccountRepository;
    private final GuideProfileRepository guideProfileRepository;
    private final TourRepository tourRepository;
    private final BookingRepository bookingRepository;
    private final GuideProfileService guideProfileService;

    @Transactional(readOnly = true)
    public Page<AdminUserSummaryResponse> listUsers(Pageable pageable) {
        return userAccountRepository.findAll(pageable).map(this::toSummary);
    }

    @Transactional
    public void updateUserStatus(UUID userId, AccountStatus status) {
        UserAccount userAccount = userAccountRepository.findById(userId)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "USER_NOT_FOUND", "User account was not found."));
        userAccount.setAccountStatus(status);
    }

    @Transactional
    public GuideDetailResponse updateGuideVerification(UUID guideId, GuideVerificationStatus status) {
        GuideProfile guideProfile = guideProfileRepository.findById(guideId)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "GUIDE_NOT_FOUND", "Guide profile was not found."));
        guideProfile.setVerificationStatus(status);
        return guideProfileService.getGuideBySlug(guideProfile.getSlug());
    }

    @Transactional(readOnly = true)
    public AdminPlatformMetricsResponse getPlatformMetrics() {
        long totalUsers = userAccountRepository.count();
        long activeUsers = userAccountRepository.countByAccountStatus(AccountStatus.ACTIVE);
        long totalGuides = guideProfileRepository.count();
        long verifiedGuides = guideProfileRepository.countByVerificationStatus(GuideVerificationStatus.VERIFIED);
        long totalTours = tourRepository.count();
        long totalBookings = bookingRepository.count();
        return new AdminPlatformMetricsResponse(totalUsers, activeUsers, verifiedGuides, totalGuides, totalTours, totalBookings);
    }

    private AdminUserSummaryResponse toSummary(UserAccount userAccount) {
        Set<String> roles = userAccount.getRoles().stream().map(role -> role.getName().name()).collect(java.util.stream.Collectors.toSet());
        return new AdminUserSummaryResponse(
                userAccount.getId(),
                userAccount.getEmail(),
                userAccount.getAccountStatus().name(),
                userAccount.isEmailVerified(),
                userAccount.getLastLoginAt(),
                roles);
    }
}
