package com.meetlocalguide.platform.modules.user.application;

import com.meetlocalguide.platform.common.exception.AppException;
import com.meetlocalguide.platform.common.security.InputSanitizer;
import com.meetlocalguide.platform.modules.user.api.dto.UpdateUserProfileRequest;
import com.meetlocalguide.platform.modules.user.api.dto.UserProfileResponse;
import com.meetlocalguide.platform.modules.user.domain.UserAccount;
import com.meetlocalguide.platform.modules.user.domain.UserProfile;
import com.meetlocalguide.platform.modules.user.domain.AccountStatus;
import com.meetlocalguide.platform.modules.user.infrastructure.UserAccountRepository;
import com.meetlocalguide.platform.modules.user.infrastructure.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserProfileService {

    private final UserAccountRepository userAccountRepository;
    private final UserProfileRepository userProfileRepository;
    private final InputSanitizer inputSanitizer;

    @Transactional(readOnly = true)
    public UserProfileResponse getMyProfile(String email) {
        UserAccount userAccount = findUserByEmail(email);
        UserProfile userProfile = userProfileRepository.findByUserAccountEmailIgnoreCase(email)
                .orElse(userAccount.getUserProfile());

        if (userProfile == null) {
            throw new AppException(HttpStatus.NOT_FOUND, "USER_PROFILE_NOT_FOUND", "User profile was not found.");
        }
        return toResponse(userAccount, userProfile);
    }

    @Transactional
    public UserProfileResponse updateMyProfile(String email, UpdateUserProfileRequest request) {
        UserAccount userAccount = findUserByEmail(email);

        UserProfile userProfile = userProfileRepository.findByUserAccountEmailIgnoreCase(email)
                .orElseGet(() -> {
                    UserProfile createdProfile = new UserProfile();
                    createdProfile.setUserAccount(userAccount);
                    createdProfile.setDisplayName(defaultDisplayName(userAccount));
                    userAccount.setUserProfile(createdProfile);
                    return createdProfile;
                });

        if (request.displayName() != null) {
            userProfile.setDisplayName(inputSanitizer.clean(request.displayName()));
        }
        if (request.avatarUrl() != null) {
            userProfile.setAvatarUrl(inputSanitizer.clean(request.avatarUrl()));
        }
        if (request.phoneNumber() != null) {
            userProfile.setPhoneNumber(inputSanitizer.clean(request.phoneNumber()));
        }
        if (request.nationality() != null) {
            userProfile.setNationality(inputSanitizer.clean(request.nationality()));
        }
        if (request.preferredLanguage() != null) {
            userProfile.setPreferredLanguage(request.preferredLanguage());
        }
        if (request.preferredCurrency() != null) {
            userProfile.setPreferredCurrency(request.preferredCurrency());
        }
        if (request.timezone() != null) {
            userProfile.setTimezone(inputSanitizer.clean(request.timezone()));
        }
        if (request.about() != null) {
            userProfile.setAbout(inputSanitizer.clean(request.about()));
        }
        if (request.dateOfBirth() != null) {
            userProfile.setDateOfBirth(request.dateOfBirth());
        }

        UserProfile persisted = userProfileRepository.save(userProfile);
        return toResponse(userAccount, persisted);
    }

    @Transactional
    public void deleteMyAccount(String email) {
        UserAccount userAccount = findUserByEmail(email);
        userAccount.setAccountStatus(AccountStatus.DEACTIVATED);
        userAccount.setEmailVerified(false);
        userAccount.setPasswordHash("{noop}deactivated-account");
    }

    private UserAccount findUserByEmail(String email) {
        return userAccountRepository.findByEmailIgnoreCase(email)
                .orElseThrow(
                        () -> new AppException(HttpStatus.NOT_FOUND, "USER_NOT_FOUND", "User account was not found."));
    }

    private String defaultDisplayName(UserAccount userAccount) {
        return userAccount.getEmail().split("@")[0];
    }

    private UserProfileResponse toResponse(UserAccount userAccount, UserProfile userProfile) {
        return new UserProfileResponse(
                userAccount.getId(),
                userAccount.getEmail(),
                userAccount.getAccountStatus().name(),
                userProfile.getDisplayName(),
                userProfile.getAvatarUrl(),
                userProfile.getPhoneNumber(),
                userProfile.getNationality(),
                userProfile.getPreferredLanguage(),
                userProfile.getPreferredCurrency(),
                userProfile.getTimezone(),
                userProfile.getAbout(),
                userProfile.getDateOfBirth());
    }
}