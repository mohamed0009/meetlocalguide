package com.meetlocalguide.platform.modules.payment.api;

import com.meetlocalguide.platform.modules.payment.api.dto.CreatePaymentRequest;
import com.meetlocalguide.platform.modules.payment.api.dto.PaymentResponse;
import com.meetlocalguide.platform.modules.payment.api.dto.PaymentStatusUpdateRequest;
import com.meetlocalguide.platform.modules.payment.application.PaymentService;
import jakarta.validation.Valid;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/payments")
public class PaymentController {

    private final PaymentService paymentService;

    @PreAuthorize("isAuthenticated()")
    @PostMapping
    public ResponseEntity<PaymentResponse> createPayment(
            Authentication authentication,
            @Valid @RequestBody CreatePaymentRequest request) {
        PaymentResponse response = paymentService.createPayment(authentication.getName(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/me")
    public ResponseEntity<Page<PaymentResponse>> listMyPayments(Authentication authentication, Pageable pageable) {
        Page<PaymentResponse> response = paymentService.listMyPayments(authentication.getName(), pageable);
        return ResponseEntity.ok(response);
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/{paymentId}")
    public ResponseEntity<PaymentResponse> getPaymentById(
            @PathVariable UUID paymentId,
            Authentication authentication) {
        PaymentResponse response = paymentService.getPayment(
                paymentId,
                authentication.getName(),
                hasAuthority(authentication, "ROLE_ADMIN"),
                hasAuthority(authentication, "ROLE_GUIDE"));
        return ResponseEntity.ok(response);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/{paymentId}/status")
    public ResponseEntity<PaymentResponse> updatePaymentStatus(
            @PathVariable UUID paymentId,
            Authentication authentication,
            @Valid @RequestBody PaymentStatusUpdateRequest request) {
        PaymentResponse response = paymentService.updatePaymentStatus(
                paymentId,
                authentication.getName(),
                hasAuthority(authentication, "ROLE_ADMIN"),
                request);
        return ResponseEntity.ok(response);
    }

    private boolean hasAuthority(Authentication authentication, String authority) {
        return authentication.getAuthorities().stream()
                .anyMatch(grantedAuthority -> authority.equals(grantedAuthority.getAuthority()));
    }
}
