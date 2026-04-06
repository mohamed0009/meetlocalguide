package com.meetlocalguide.platform.modules.guide.api;

import com.meetlocalguide.platform.modules.guide.api.dto.GuideDetailResponse;
import com.meetlocalguide.platform.modules.guide.api.dto.GuideSummaryResponse;
import com.meetlocalguide.platform.modules.guide.api.dto.UpsertGuideProfileRequest;
import com.meetlocalguide.platform.modules.guide.application.GuideProfileService;
import com.meetlocalguide.platform.modules.guide.domain.GuideVerificationStatus;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/guides")
public class GuideController {

    private final GuideProfileService guideProfileService;

    @GetMapping
    public ResponseEntity<Page<GuideSummaryResponse>> listGuides(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) GuideVerificationStatus status,
            Pageable pageable) {
        Page<GuideSummaryResponse> response = guideProfileService.listGuides(city, status, pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{slug}")
    public ResponseEntity<GuideDetailResponse> getGuideBySlug(@PathVariable String slug) {
        GuideDetailResponse response = guideProfileService.getGuideBySlug(slug);
        return ResponseEntity.ok(response);
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/me")
    public ResponseEntity<GuideDetailResponse> getMyGuideProfile(Authentication authentication) {
        GuideDetailResponse response = guideProfileService.getMyGuideProfile(authentication.getName());
        return ResponseEntity.ok(response);
    }

    @PreAuthorize("isAuthenticated()")
    @PutMapping("/me")
    public ResponseEntity<GuideDetailResponse> upsertMyGuideProfile(
            Authentication authentication,
            @Valid @RequestBody UpsertGuideProfileRequest request) {
        GuideDetailResponse response = guideProfileService.upsertMyGuideProfile(authentication.getName(), request);
        return ResponseEntity.ok(response);
    }
}