package com.meetlocalguide.platform.modules.user.api;

import com.meetlocalguide.platform.modules.user.api.dto.UpdateUserProfileRequest;
import com.meetlocalguide.platform.modules.user.api.dto.UserProfileResponse;
import com.meetlocalguide.platform.modules.user.application.UserProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserProfileService userProfileService;

    @GetMapping("/me")
    public ResponseEntity<UserProfileResponse> getMyProfile(Authentication authentication) {
        UserProfileResponse response = userProfileService.getMyProfile(authentication.getName());
        return ResponseEntity.ok(response);
    }

    @PutMapping("/me")
    public ResponseEntity<UserProfileResponse> updateMyProfile(
            Authentication authentication,
            @Valid @RequestBody UpdateUserProfileRequest request) {
        UserProfileResponse response = userProfileService.updateMyProfile(authentication.getName(), request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/me")
    public ResponseEntity<Void> deleteMyAccount(Authentication authentication) {
        userProfileService.deleteMyAccount(authentication.getName());
        return ResponseEntity.noContent().build();
    }
}