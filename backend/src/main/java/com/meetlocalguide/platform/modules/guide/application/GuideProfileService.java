package com.meetlocalguide.platform.modules.guide.application;

import com.meetlocalguide.platform.common.exception.AppException;
import com.meetlocalguide.platform.modules.auth.domain.Role;
import com.meetlocalguide.platform.modules.auth.domain.RoleName;
import com.meetlocalguide.platform.modules.auth.infrastructure.RoleRepository;
import com.meetlocalguide.platform.modules.guide.api.dto.GuideDetailResponse;
import com.meetlocalguide.platform.modules.guide.api.dto.GuideSummaryResponse;
import com.meetlocalguide.platform.modules.guide.api.dto.UpsertGuideProfileRequest;
import com.meetlocalguide.platform.modules.guide.domain.GuideProfile;
import com.meetlocalguide.platform.modules.guide.domain.GuideVerificationStatus;
import com.meetlocalguide.platform.modules.guide.infrastructure.GuideProfileRepository;
import com.meetlocalguide.platform.modules.user.domain.UserAccount;
import com.meetlocalguide.platform.modules.user.infrastructure.UserAccountRepository;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class GuideProfileService {

    private final GuideProfileRepository guideProfileRepository;
    private final UserAccountRepository userAccountRepository;
    private final RoleRepository roleRepository;

    @Transactional(readOnly = true)
    public Page<GuideSummaryResponse> listGuides(String city, GuideVerificationStatus status, Pageable pageable) {
        return guideProfileRepository.search(city, status, pageable)
                .map(this::toSummaryResponse);
    }

    @Transactional(readOnly = true)
    public GuideDetailResponse getGuideBySlug(String slug) {
        GuideProfile guideProfile = guideProfileRepository.findBySlug(slug)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "GUIDE_NOT_FOUND",
                        "Guide profile was not found."));
        return toDetailResponse(guideProfile);
    }

    @Transactional(readOnly = true)
    public GuideDetailResponse getMyGuideProfile(String email) {
        GuideProfile guideProfile = guideProfileRepository.findByUserAccountEmailIgnoreCase(email)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "GUIDE_PROFILE_NOT_FOUND",
                        "Guide profile was not found."));
        return toDetailResponse(guideProfile);
    }

    @Transactional
    public GuideDetailResponse upsertMyGuideProfile(String email, UpsertGuideProfileRequest request) {
        UserAccount userAccount = userAccountRepository.findByEmailIgnoreCase(email)
                .orElseThrow(
                        () -> new AppException(HttpStatus.NOT_FOUND, "USER_NOT_FOUND", "User account was not found."));

        guideProfileRepository.findBySlug(request.slug().trim())
                .filter(existing -> !existing.getUserAccount().getId().equals(userAccount.getId()))
                .ifPresent(existing -> {
                    throw new AppException(HttpStatus.CONFLICT, "GUIDE_SLUG_ALREADY_USED",
                            "Guide slug is already used.");
                });

        GuideProfile guideProfile = guideProfileRepository.findByUserAccountEmailIgnoreCase(email)
                .orElseGet(() -> {
                    GuideProfile created = new GuideProfile();
                    created.setUserAccount(userAccount);
                    created.setVerificationStatus(GuideVerificationStatus.PENDING);
                    return created;
                });

        guideProfile.setSlug(request.slug().trim().toLowerCase());
        guideProfile.setBio(request.bio().trim());
        guideProfile.setYearsExperience(request.yearsExperience());
        guideProfile.setCity(request.city().trim());
        guideProfile.setCountry(request.country().trim());
        guideProfile.setHourlyRateAmount(request.hourlyRateAmount());
        guideProfile.setLanguages(request.languages());

        ensureGuideRole(userAccount);

        GuideProfile persisted = guideProfileRepository.save(guideProfile);
        return toDetailResponse(persisted);
    }

    private void ensureGuideRole(UserAccount userAccount) {
        boolean alreadyGuide = userAccount.getRoles().stream()
                .anyMatch(role -> role.getName() == RoleName.ROLE_GUIDE);
        if (alreadyGuide) {
            return;
        }

        Role guideRole = roleRepository.findByName(RoleName.ROLE_GUIDE)
                .orElseThrow(() -> new AppException(
                        HttpStatus.INTERNAL_SERVER_ERROR,
                        "ROLE_CONFIGURATION_ERROR",
                        "Guide role is not configured."));
        userAccount.getRoles().add(guideRole);
    }

    private GuideSummaryResponse toSummaryResponse(GuideProfile guideProfile) {
        return new GuideSummaryResponse(
                guideProfile.getId(),
                guideProfile.getSlug(),
                extractDisplayName(guideProfile),
                guideProfile.getCity(),
                guideProfile.getCountry(),
                guideProfile.getVerificationStatus().name(),
                guideProfile.getAverageRating(),
                guideProfile.getTotalReviews(),
                Set.copyOf(guideProfile.getLanguages()));
    }

    private GuideDetailResponse toDetailResponse(GuideProfile guideProfile) {
        UserAccount userAccount = guideProfile.getUserAccount();
        return new GuideDetailResponse(
                guideProfile.getId(),
                userAccount.getId(),
                guideProfile.getSlug(),
                extractDisplayName(guideProfile),
                userAccount.getEmail(),
                guideProfile.getBio(),
                guideProfile.getYearsExperience(),
                guideProfile.getCity(),
                guideProfile.getCountry(),
                guideProfile.getVerificationStatus().name(),
                guideProfile.getHourlyRateAmount(),
                guideProfile.getAverageRating(),
                guideProfile.getTotalReviews(),
                Set.copyOf(guideProfile.getLanguages()));
    }

    private String extractDisplayName(GuideProfile guideProfile) {
        if (guideProfile.getUserAccount().getUserProfile() != null
                && guideProfile.getUserAccount().getUserProfile().getDisplayName() != null
                && !guideProfile.getUserAccount().getUserProfile().getDisplayName().isBlank()) {
            return guideProfile.getUserAccount().getUserProfile().getDisplayName();
        }
        return guideProfile.getUserAccount().getEmail().split("@")[0];
    }
}