package com.meetlocalguide.platform.modules.tour.api;

import com.meetlocalguide.platform.modules.tour.api.dto.CreateTourRequest;
import com.meetlocalguide.platform.modules.tour.api.dto.TourDetailResponse;
import com.meetlocalguide.platform.modules.tour.api.dto.TourSummaryResponse;
import com.meetlocalguide.platform.modules.tour.api.dto.UpdateTourRequest;
import com.meetlocalguide.platform.modules.tour.application.TourService;
import com.meetlocalguide.platform.modules.tour.domain.TourStatus;
import jakarta.validation.Valid;
import java.math.BigDecimal;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/tours")
public class TourController {

    private final TourService tourService;

    @GetMapping
    public ResponseEntity<Page<TourSummaryResponse>> listTours(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) TourStatus status,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Integer minDuration,
            @RequestParam(required = false) Integer maxDuration,
            @RequestParam(required = false, name = "q") String title,
            Pageable pageable) {
        Page<TourSummaryResponse> response = tourService.listTours(
                city,
                status,
                minPrice,
                maxPrice,
                minDuration,
                maxDuration,
                title,
                pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{slug}")
    public ResponseEntity<TourDetailResponse> getTourBySlug(@PathVariable String slug) {
        TourDetailResponse response = tourService.getTourBySlug(slug);
        return ResponseEntity.ok(response);
    }

    @PreAuthorize("isAuthenticated()")
    @PostMapping
    public ResponseEntity<TourDetailResponse> createTour(
            Authentication authentication,
            @Valid @RequestBody CreateTourRequest request) {
        TourDetailResponse response = tourService.createTour(authentication.getName(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PreAuthorize("isAuthenticated()")
    @PutMapping("/{tourId}")
    public ResponseEntity<TourDetailResponse> updateTour(
            @PathVariable UUID tourId,
            Authentication authentication,
            @Valid @RequestBody UpdateTourRequest request) {
        TourDetailResponse response = tourService.updateTour(tourId, authentication.getName(), isAdmin(authentication),
                request);
        return ResponseEntity.ok(response);
    }

    @PreAuthorize("isAuthenticated()")
    @DeleteMapping("/{tourId}")
    public ResponseEntity<Void> archiveTour(@PathVariable UUID tourId, Authentication authentication) {
        tourService.archiveTour(tourId, authentication.getName(), isAdmin(authentication));
        return ResponseEntity.noContent().build();
    }

    private boolean isAdmin(Authentication authentication) {
        return authentication.getAuthorities().stream()
                .anyMatch(grantedAuthority -> "ROLE_ADMIN".equals(grantedAuthority.getAuthority()));
    }
}