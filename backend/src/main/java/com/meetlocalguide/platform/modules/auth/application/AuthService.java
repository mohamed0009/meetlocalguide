package com.meetlocalguide.platform.modules.auth.application;

import com.meetlocalguide.platform.common.domain.CurrencyCode;
import com.meetlocalguide.platform.common.domain.SupportedLocale;
import com.meetlocalguide.platform.common.exception.AppException;
import com.meetlocalguide.platform.config.security.JwtTokenProvider;
import com.meetlocalguide.platform.modules.auth.api.dto.AuthResponse;
import com.meetlocalguide.platform.modules.auth.api.dto.AuthUserView;
import com.meetlocalguide.platform.modules.auth.api.dto.LoginRequest;
import com.meetlocalguide.platform.modules.auth.api.dto.LogoutRequest;
import com.meetlocalguide.platform.modules.auth.api.dto.RefreshTokenRequest;
import com.meetlocalguide.platform.modules.auth.api.dto.RegisterRequest;
import com.meetlocalguide.platform.modules.auth.domain.RefreshToken;
import com.meetlocalguide.platform.modules.auth.domain.Role;
import com.meetlocalguide.platform.modules.auth.domain.RoleName;
import com.meetlocalguide.platform.modules.auth.infrastructure.RefreshTokenRepository;
import com.meetlocalguide.platform.modules.auth.infrastructure.RoleRepository;
import com.meetlocalguide.platform.modules.user.domain.AccountStatus;
import com.meetlocalguide.platform.modules.user.domain.AuthProvider;
import com.meetlocalguide.platform.modules.user.domain.UserAccount;
import com.meetlocalguide.platform.modules.user.domain.UserProfile;
import com.meetlocalguide.platform.modules.user.infrastructure.UserAccountRepository;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Base64;
import java.util.Comparator;
import java.util.HexFormat;
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
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    private final SecureRandom secureRandom = new SecureRandom();

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
        userAccount.setAccountStatus(AccountStatus.ACTIVE);
        userAccount.setEmailVerified(false);
        userAccount.getRoles().add(roleUser);

        UserProfile userProfile = new UserProfile();
        userProfile.setUserAccount(userAccount);
        userProfile.setDisplayName(request.displayName().trim());
        userProfile.setPreferredLanguage(SupportedLocale.EN);
        userProfile.setPreferredCurrency(CurrencyCode.MAD);
        userAccount.setUserProfile(userProfile);

        UserAccount persisted = userAccountRepository.save(userAccount);
        return issueTokens(persisted, clientMetadata);
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

        if (userAccount.getAccountStatus() != AccountStatus.ACTIVE) {
            throw new AppException(HttpStatus.FORBIDDEN, "ACCOUNT_NOT_ACTIVE", "Account is not active.");
        }

        userAccount.setLastLoginAt(Instant.now());
        return issueTokens(userAccount, clientMetadata);
    }

    @Transactional
    public AuthResponse refreshToken(RefreshTokenRequest request, ClientMetadata clientMetadata) {
        String refreshToken = request.refreshToken().trim();
        RefreshToken persistedToken = refreshTokenRepository.findByTokenHashAndRevokedFalse(hashToken(refreshToken))
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

        refreshTokenRepository.findByTokenHashAndRevokedFalse(hashToken(request.refreshToken().trim()))
                .ifPresent(this::revokeToken);
    }

    private AuthResponse issueTokens(UserAccount userAccount, ClientMetadata clientMetadata) {
        String accessToken = jwtTokenProvider.generateAccessToken(userAccount);
        String plainRefreshToken = generateRefreshToken();

        RefreshToken refreshTokenEntity = new RefreshToken();
        refreshTokenEntity.setUserAccount(userAccount);
        refreshTokenEntity.setTokenHash(hashToken(plainRefreshToken));
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

    private String generateRefreshToken() {
        byte[] bytes = new byte[64];
        secureRandom.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    private String hashToken(String plainToken) {
        try {
            MessageDigest messageDigest = MessageDigest.getInstance("SHA-256");
            byte[] digest = messageDigest.digest(plainToken.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(digest);
        } catch (NoSuchAlgorithmException exception) {
            throw new IllegalStateException("SHA-256 hashing algorithm is not available.", exception);
        }
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase();
    }
}