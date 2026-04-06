package com.meetlocalguide.platform.modules.auth.api;

import com.meetlocalguide.platform.modules.auth.api.dto.AuthResponse;
import com.meetlocalguide.platform.modules.auth.api.dto.LoginRequest;
import com.meetlocalguide.platform.modules.auth.api.dto.LogoutRequest;
import com.meetlocalguide.platform.modules.auth.api.dto.RefreshTokenRequest;
import com.meetlocalguide.platform.modules.auth.api.dto.RegisterRequest;
import com.meetlocalguide.platform.modules.auth.application.AuthService;
import com.meetlocalguide.platform.modules.auth.application.ClientMetadata;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @Valid @RequestBody RegisterRequest request,
            HttpServletRequest httpServletRequest) {
        AuthResponse response = authService.register(request, extractClientMetadata(httpServletRequest));
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletRequest httpServletRequest) {
        AuthResponse response = authService.login(request, extractClientMetadata(httpServletRequest));
        return ResponseEntity.ok(response);
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refreshToken(
            @Valid @RequestBody RefreshTokenRequest request,
            HttpServletRequest httpServletRequest) {
        AuthResponse response = authService.refreshToken(request, extractClientMetadata(httpServletRequest));
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@RequestBody(required = false) LogoutRequest request) {
        authService.logout(request);
        return ResponseEntity.noContent().build();
    }

    private ClientMetadata extractClientMetadata(HttpServletRequest request) {
        String ipAddress = Optional.ofNullable(request.getHeader("X-Forwarded-For"))
                .map(value -> value.split(",")[0].trim())
                .orElse(request.getRemoteAddr());
        String userAgent = request.getHeader("User-Agent");
        return new ClientMetadata(ipAddress, userAgent);
    }
}