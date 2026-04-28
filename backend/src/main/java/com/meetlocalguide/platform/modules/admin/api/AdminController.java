package com.meetlocalguide.platform.modules.admin.api;

import com.meetlocalguide.platform.modules.admin.api.dto.AdminPlatformMetricsResponse;
import com.meetlocalguide.platform.modules.admin.api.dto.AdminUserSummaryResponse;
import com.meetlocalguide.platform.modules.admin.api.dto.GuideVerificationRequest;
import com.meetlocalguide.platform.modules.admin.application.AdminService;
import com.meetlocalguide.platform.modules.admin.application.AuditLogService;
import com.meetlocalguide.platform.modules.guide.api.dto.GuideDetailResponse;
import com.meetlocalguide.platform.modules.user.domain.AccountStatus;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;
    private final AuditLogService auditLogService;

    @GetMapping("/users")
    public ResponseEntity<Page<AdminUserSummaryResponse>> listUsers(Pageable pageable) {
        return ResponseEntity.ok(adminService.listUsers(pageable));
    }

    @PatchMapping("/users/{id}/status")
    public ResponseEntity<Void> updateUserStatus(
            @PathVariable UUID id,
            @RequestParam AccountStatus status,
            Authentication authentication,
            HttpServletRequest request) {
        adminService.updateUserStatus(id, status);
        auditLogService.log(authentication.getName(), "ADMIN_UPDATE_USER_STATUS", "USER", id.toString(),
                "Status changed to " + status, request);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/guides/{id}/verification")
    public ResponseEntity<GuideDetailResponse> updateGuideVerification(
            @PathVariable UUID id,
            @Valid @RequestBody GuideVerificationRequest verificationRequest,
            Authentication authentication,
            HttpServletRequest request) {
        GuideDetailResponse response = adminService.updateGuideVerification(id, verificationRequest.status());
        auditLogService.log(authentication.getName(), "ADMIN_UPDATE_GUIDE_VERIFICATION", "GUIDE", id.toString(),
                "Verification set to " + verificationRequest.status(), request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/metrics")
    public ResponseEntity<AdminPlatformMetricsResponse> metrics() {
        return ResponseEntity.ok(adminService.getPlatformMetrics());
    }
}
