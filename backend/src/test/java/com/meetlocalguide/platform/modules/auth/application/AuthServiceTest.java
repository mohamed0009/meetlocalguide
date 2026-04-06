package com.meetlocalguide.platform.modules.auth.application;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.meetlocalguide.platform.common.exception.AppException;
import com.meetlocalguide.platform.config.security.JwtProperties;
import com.meetlocalguide.platform.config.security.JwtTokenProvider;
import com.meetlocalguide.platform.modules.auth.api.dto.AuthResponse;
import com.meetlocalguide.platform.modules.auth.api.dto.LoginRequest;
import com.meetlocalguide.platform.modules.auth.api.dto.RegisterRequest;
import com.meetlocalguide.platform.modules.auth.domain.RefreshToken;
import com.meetlocalguide.platform.modules.auth.domain.Role;
import com.meetlocalguide.platform.modules.auth.domain.RoleName;
import com.meetlocalguide.platform.modules.auth.infrastructure.RefreshTokenRepository;
import com.meetlocalguide.platform.modules.auth.infrastructure.RoleRepository;
import com.meetlocalguide.platform.modules.user.domain.AccountStatus;
import com.meetlocalguide.platform.modules.user.domain.UserAccount;
import com.meetlocalguide.platform.modules.user.infrastructure.UserAccountRepository;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserAccountRepository userAccountRepository;

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private RefreshTokenRepository refreshTokenRepository;

    private PasswordEncoder passwordEncoder;
    private AuthService authService;

    @BeforeEach
    void setUp() {
        passwordEncoder = new BCryptPasswordEncoder();

        JwtProperties jwtProperties = new JwtProperties();
        jwtProperties.setIssuer("meetlocalguide-test");
        jwtProperties.setAccessTokenMinutes(15);
        jwtProperties.setRefreshTokenDays(30);
        jwtProperties.setSecret(Base64.getEncoder().encodeToString(
                "meetlocalguide-unit-test-secret-key-32bytes-minimum".getBytes(StandardCharsets.UTF_8)));

        JwtTokenProvider jwtTokenProvider = new JwtTokenProvider(jwtProperties);
        authService = new AuthService(
                userAccountRepository,
                roleRepository,
                refreshTokenRepository,
                passwordEncoder,
                jwtTokenProvider);
    }

    @Test
    void registerShouldCreateUserAndReturnTokens() {
        RegisterRequest request = new RegisterRequest("NewUser@Example.com", "StrongPass1!", "New User");
        ClientMetadata metadata = new ClientMetadata("127.0.0.1", "JUnit");

        Role roleUser = new Role();
        roleUser.setName(RoleName.ROLE_USER);

        when(userAccountRepository.existsByEmailIgnoreCase("newuser@example.com")).thenReturn(false);
        when(roleRepository.findByName(RoleName.ROLE_USER)).thenReturn(Optional.of(roleUser));
        when(userAccountRepository.save(any(UserAccount.class))).thenAnswer(invocation -> {
            UserAccount userAccount = invocation.getArgument(0);
            userAccount.setId(UUID.randomUUID());
            return userAccount;
        });
        when(refreshTokenRepository.save(any(RefreshToken.class))).thenAnswer(invocation -> invocation.getArgument(0));

        AuthResponse response = authService.register(request, metadata);

        assertNotNull(response.accessToken());
        assertNotNull(response.refreshToken());
        assertEquals("Bearer", response.tokenType());
        assertEquals("newuser@example.com", response.user().email());
        verify(userAccountRepository).save(any(UserAccount.class));
        verify(refreshTokenRepository).save(any(RefreshToken.class));
    }

    @Test
    void loginShouldFailWhenPasswordDoesNotMatch() {
        LoginRequest request = new LoginRequest("existing@example.com", "WrongPass1!");
        ClientMetadata metadata = new ClientMetadata("127.0.0.1", "JUnit");

        UserAccount userAccount = new UserAccount();
        userAccount.setEmail("existing@example.com");
        userAccount.setPasswordHash(passwordEncoder.encode("StrongPass1!"));
        userAccount.setAccountStatus(AccountStatus.ACTIVE);

        when(userAccountRepository.findByEmailIgnoreCase("existing@example.com")).thenReturn(Optional.of(userAccount));

        AppException appException = assertThrows(AppException.class, () -> authService.login(request, metadata));
        assertEquals(HttpStatus.UNAUTHORIZED, appException.getStatus());
        assertEquals("INVALID_CREDENTIALS", appException.getErrorCode());
    }
}