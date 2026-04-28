package com.meetlocalguide.platform.modules.auth.application;

import com.meetlocalguide.platform.common.domain.CurrencyCode;
import com.meetlocalguide.platform.common.domain.SupportedLocale;
import com.meetlocalguide.platform.common.exception.AppException;
import com.meetlocalguide.platform.config.security.JwtTokenProvider;
import com.meetlocalguide.platform.modules.auth.api.dto.AuthResponse;
import com.meetlocalguide.platform.modules.auth.api.dto.ForgotPasswordRequest;
import com.meetlocalguide.platform.modules.auth.api.dto.AuthUserView;
import com.meetlocalguide.platform.modules.auth.api.dto.LoginRequest;
import com.meetlocalguide.platform.modules.auth.api.dto.LogoutRequest;
import com.meetlocalguide.platform.modules.auth.api.dto.RefreshTokenRequest;
import com.meetlocalguide.platform.modules.auth.api.dto.RegisterRequest;
import com.meetlocalguide.platform.modules.auth.api.dto.ResetPasswordRequest;
import com.meetlocalguide.platform.modules.auth.api.dto.VerifyEmailRequest;
import com.meetlocalguide.platform.modules.auth.domain.EmailVerificationToken;
import com.meetlocalguide.platform.modules.auth.domain.PasswordResetToken;
import com.meetlocalguide.platform.modules.auth.domain.RefreshToken;
import com.meetlocalguide.platform.modules.auth.domain.Role;
import com.meetlocalguide.platform.modules.auth.domain.RoleName;
import com.meetlocalguide.platform.modules.auth.infrastructure.EmailVerificationTokenRepository;
import com.meetlocalguide.platform.modules.auth.infrastructure.PasswordResetTokenRepository;
import com.meetlocalguide.platform.modules.auth.infrastructure.RefreshTokenRepository;
import com.meetlocalguide.platform.modules.auth.infrastructure.RoleRepository;
import com.meetlocalguide.platform.modules.notification.application.NotificationService;
import com.meetlocalguide.platform.modules.user.domain.AccountStatus;
import com.meetlocalguide.platform.modules.user.domain.AuthProvider;
import com.meetlocalguide.platform.modules.user.domain.UserAccount;
import com.meetlocalguide.platform.modules.user.domain.UserProfile;
import com.meetlocalguide.platform.modules.user.infrastructure.UserAccountRepository;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Comparator;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserAccountRepository userAccountRepository;
    private final RoleRepository roleRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final EmailVerificationTokenRepository emailVerificationTokenRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final TokenCryptoService tokenCryptoService;
    private final NotificationService notificationService;

    @Transactional
    public AuthResponse register(RegisterRequest request, ClientMetadata clientMetadata) {
        String normalizedEmail = normalizeEmail(request.email());
        if (userAccountRepository.existsByEmailIgnoreCase(normalizedEmail)) {
            throw new AppException(HttpStatus.CONFLICT, "EMAIL_ALREADY_USED", "Email is already registered.");
        }

        Role roleUser = roleRepository.findByName(RoleName.ROLE_USER)
                .orElseThrow(() -> new AppException(
                        HttpStatus.INTERNAL_SERVER_ERROR,
                        "ROLE_CONFIGURATION_ERROR",
                        "Default user role is not configured."));

        UserAccount userAccount = new UserAccount();
        userAccount.setEmail(normalizedEmail);
        userAccount.setPasswordHash(passwordEncoder.encode(request.password()));
        userAccount.setAuthProvider(AuthProvider.LOCAL);
        userAccount.setAccountStatus(AccountStatus.PENDING_VERIFICATION);
        userAccount.setEmailVerified(false);
        userAccount.getRoles().add(roleUser);

        UserProfile userProfile = new UserProfile();
        userProfile.setUserAccount(userAccount);
        userProfile.setDisplayName(request.displayName().trim());
        userProfile.setPreferredLanguage(SupportedLocale.EN);
        userProfile.setPreferredCurrency(CurrencyCode.MAD);
        userAccount.setUserProfile(userProfile);

        UserAccount persisted = userAccountRepository.save(userAccount);
        issueEmailVerificationToken(persisted);
        return new AuthResponse("Bearer", "", 0, "", toAuthUserView(persisted));
    }

    @Transactional
    public AuthResponse login(LoginRequest request, ClientMetadata clientMetadata) {
        String normalizedEmail = normalizeEmail(request.email());
        UserAccount userAccount = userAccountRepository.findByEmailIgnoreCase(normalizedEmail)
                .orElseThrow(() -> new AppException(HttpStatus.UNAUTHORIZED, "INVALID_CREDENTIALS",
                        "Invalid email or password."));

        if (!passwordEncoder.matches(request.password(), userAccount.getPasswordHash())) {
            throw new AppException(HttpStatus.UNAUTHORIZED, "INVALID_CREDENTIALS", "Invalid email or password.");
        }

        if (!userAccount.isEmailVerified() || userAccount.getAccountStatus() == AccountStatus.PENDING_VERIFICATION) {
            throw new AppException(HttpStatus.FORBIDDEN, "EMAIL_NOT_VERIFIED", "Please verify your email before login.");
        }

        if (userAccount.getAccountStatus() != AccountStatus.ACTIVE) {
            throw new AppException(HttpStatus.FORBIDDEN, "ACCOUNT_NOT_ACTIVE", "Account is not active.");
        }

        userAccount.setLastLoginAt(Instant.now());
        return issueTokens(userAccount, clientMetadata);
    }

    @Transactional
    public AuthResponse refreshToken(RefreshTokenRequest request, ClientMetadata clientMetadata) {
        String refreshToken = request.refreshToken().trim();
        RefreshToken persistedToken = refreshTokenRepository
                .findByTokenHashAndRevokedFalse(tokenCryptoService.hashToken(refreshToken))
                .orElseThrow(() -> new AppException(HttpStatus.UNAUTHORIZED, "INVALID_REFRESH_TOKEN",
                        "Refresh token is invalid."));

        if (persistedToken.getExpiresAt().isBefore(Instant.now())) {
            revokeToken(persistedToken);
            throw new AppException(HttpStatus.UNAUTHORIZED, "REFRESH_TOKEN_EXPIRED", "Refresh token has expired.");
        }

        UserAccount userAccount = persistedToken.getUserAccount();
        if (userAccount.getAccountStatus() != AccountStatus.ACTIVE) {
            throw new AppException(HttpStatus.FORBIDDEN, "ACCOUNT_NOT_ACTIVE", "Account is not active.");
        }

        revokeToken(persistedToken);
        return issueTokens(userAccount, clientMetadata);
    }

    @Transactional
    public void logout(LogoutRequest request) {
        if (request == null || request.refreshToken() == null || request.refreshToken().isBlank()) {
            return;
        }

        refreshTokenRepository.findByTokenHashAndRevokedFalse(tokenCryptoService.hashToken(request.refreshToken().trim()))
                .ifPresent(this::revokeToken);
    }

    @Transactional
    public void verifyEmail(VerifyEmailRequest request) {
        EmailVerificationToken persistedToken = emailVerificationTokenRepository
                .findByTokenHashAndConsumedAtIsNull(tokenCryptoService.hashToken(request.token().trim()))
                .orElseThrow(() -> new AppException(HttpStatus.UNAUTHORIZED, "INVALID_VERIFICATION_TOKEN",
                        "Email verification token is invalid."));

        if (persistedToken.getExpiresAt().isBefore(Instant.now())) {
            throw new AppException(HttpStatus.UNAUTHORIZED, "VERIFICATION_TOKEN_EXPIRED",
                    "Email verification token has expired.");
        }

        persistedToken.setConsumedAt(Instant.now());
        UserAccount userAccount = persistedToken.getUserAccount();
        userAccount.setEmailVerified(true);
        userAccount.setAccountStatus(AccountStatus.ACTIVE);
    }

    @Transactional
    public void forgotPassword(ForgotPasswordRequest request) {
        userAccountRepository.findByEmailIgnoreCase(normalizeEmail(request.email()))
                .ifPresent(this::issuePasswordResetToken);
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        PasswordResetToken resetToken = passwordResetTokenRepository
                .findByTokenHashAndConsumedAtIsNull(tokenCryptoService.hashToken(request.token().trim()))
                .orElseThrow(() -> new AppException(HttpStatus.UNAUTHORIZED, "INVALID_PASSWORD_RESET_TOKEN",
                        "Password reset token is invalid."));

        if (resetToken.getExpiresAt().isBefore(Instant.now())) {
            throw new AppException(HttpStatus.UNAUTHORIZED, "PASSWORD_RESET_TOKEN_EXPIRED",
                    "Password reset token has expired.");
        }

        resetToken.setConsumedAt(Instant.now());
        UserAccount userAccount = resetToken.getUserAccount();
        userAccount.setPasswordHash(passwordEncoder.encode(request.newPassword()));
        refreshTokenRepository.deleteByUserAccount(userAccount);
    }

    private AuthResponse issueTokens(UserAccount userAccount, ClientMetadata clientMetadata) {
        String accessToken = jwtTokenProvider.generateAccessToken(userAccount);
        String plainRefreshToken = tokenCryptoService.generateSecureToken();

        RefreshToken refreshTokenEntity = new RefreshToken();
        refreshTokenEntity.setUserAccount(userAccount);
        refreshTokenEntity.setTokenHash(tokenCryptoService.hashToken(plainRefreshToken));
        refreshTokenEntity.setExpiresAt(Instant.now().plus(jwtTokenProvider.getRefreshTokenTtlDays(), ChronoUnit.DAYS));
        refreshTokenEntity.setIpAddress(clientMetadata.ipAddress());
        refreshTokenEntity.setUserAgent(clientMetadata.userAgent());

        refreshTokenRepository.save(refreshTokenEntity);

        return new AuthResponse(
                "Bearer",
                accessToken,
                jwtTokenProvider.getAccessTokenTtlSeconds(),
                plainRefreshToken,
                toAuthUserView(userAccount));
    }

    private AuthUserView toAuthUserView(UserAccount userAccount) {
        List<String> roles = userAccount.getRoles().stream()
                .map(role -> role.getName().name())
                .sorted(Comparator.naturalOrder())
                .toList();

        return new AuthUserView(
                userAccount.getId(),
                userAccount.getEmail(),
                userAccount.getAccountStatus().name(),
                roles);
    }

    private void revokeToken(RefreshToken refreshToken) {
        refreshToken.setRevoked(true);
        refreshToken.setRevokedAt(Instant.now());
    }

    private void issueEmailVerificationToken(UserAccount userAccount) {
        emailVerificationTokenRepository.deleteByUserAccount(userAccount);
        String plainToken = tokenCryptoService.generateSecureToken();

        EmailVerificationToken verificationToken = new EmailVerificationToken();
        verificationToken.setUserAccount(userAccount);
        verificationToken.setTokenHash(tokenCryptoService.hashToken(plainToken));
        verificationToken.setExpiresAt(Instant.now().plus(24, ChronoUnit.HOURS));
        emailVerificationTokenRepository.save(verificationToken);
        notificationService.sendEmailVerification(userAccount.getEmail(), plainToken);
    }

    private void issuePasswordResetToken(UserAccount userAccount) {
        passwordResetTokenRepository.deleteByUserAccount(userAccount);
        String plainToken = tokenCryptoService.generateSecureToken();

        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setUserAccount(userAccount);
        resetToken.setTokenHash(tokenCryptoService.hashToken(plainToken));
        resetToken.setExpiresAt(Instant.now().plus(30, ChronoUnit.MINUTES));
        passwordResetTokenRepository.save(resetToken);
        notificationService.sendPasswordReset(userAccount.getEmail(), plainToken);
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase();
    }
}