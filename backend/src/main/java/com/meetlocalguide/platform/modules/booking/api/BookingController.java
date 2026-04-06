package com.meetlocalguide.platform.modules.booking.api;

import com.meetlocalguide.platform.modules.booking.api.dto.BookingResponse;
import com.meetlocalguide.platform.modules.booking.api.dto.BookingStatusUpdateRequest;
import com.meetlocalguide.platform.modules.booking.api.dto.CancelBookingRequest;
import com.meetlocalguide.platform.modules.booking.api.dto.CreateBookingRequest;
import com.meetlocalguide.platform.modules.booking.application.BookingService;
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
@RequestMapping("/api/v1/bookings")
public class BookingController {

    private final BookingService bookingService;

    @PreAuthorize("isAuthenticated()")
    @PostMapping
    public ResponseEntity<BookingResponse> createBooking(
            Authentication authentication,
            @Valid @RequestBody CreateBookingRequest request) {
        BookingResponse response = bookingService.createBooking(authentication.getName(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/me")
    public ResponseEntity<Page<BookingResponse>> listMyBookings(Authentication authentication, Pageable pageable) {
        Page<BookingResponse> response = bookingService.listMyBookings(authentication.getName(), pageable);
        return ResponseEntity.ok(response);
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/{bookingId}")
    public ResponseEntity<BookingResponse> getBookingById(
            @PathVariable UUID bookingId,
            Authentication authentication) {
        BookingResponse response = bookingService.getBooking(
                bookingId,
                authentication.getName(),
                hasAuthority(authentication, "ROLE_ADMIN"),
                hasAuthority(authentication, "ROLE_GUIDE"));
        return ResponseEntity.ok(response);
    }

    @PreAuthorize("isAuthenticated()")
    @PatchMapping("/{bookingId}/cancel")
    public ResponseEntity<BookingResponse> cancelBooking(
            @PathVariable UUID bookingId,
            Authentication authentication,
            @Valid @RequestBody(required = false) CancelBookingRequest request) {
        BookingResponse response = bookingService.cancelBooking(
                bookingId,
                authentication.getName(),
                hasAuthority(authentication, "ROLE_ADMIN"),
                request);
        return ResponseEntity.ok(response);
    }

    @PreAuthorize("hasAnyRole('GUIDE','ADMIN')")
    @PatchMapping("/{bookingId}/status")
    public ResponseEntity<BookingResponse> updateBookingStatus(
            @PathVariable UUID bookingId,
            Authentication authentication,
            @Valid @RequestBody BookingStatusUpdateRequest request) {
        BookingResponse response = bookingService.updateBookingStatus(
                bookingId,
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