package com.meetlocalguide.platform.modules.favorite.api;

import com.meetlocalguide.platform.modules.favorite.api.dto.FavoriteResponse;
import com.meetlocalguide.platform.modules.favorite.application.FavoriteService;
import java.util.Map;
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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/favorites")
public class FavoriteController {

    private final FavoriteService favoriteService;

    @PreAuthorize("isAuthenticated()")
    @PostMapping("/{tourId}")
    public ResponseEntity<FavoriteResponse> addFavorite(
            @PathVariable UUID tourId,
            Authentication authentication) {
        FavoriteResponse response = favoriteService.addFavorite(authentication.getName(), tourId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PreAuthorize("isAuthenticated()")
    @DeleteMapping("/{tourId}")
    public ResponseEntity<Void> removeFavorite(
            @PathVariable UUID tourId,
            Authentication authentication) {
        favoriteService.removeFavorite(authentication.getName(), tourId);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/me")
    public ResponseEntity<Page<FavoriteResponse>> listMyFavorites(
            Authentication authentication,
            Pageable pageable) {
        Page<FavoriteResponse> response = favoriteService.listMyFavorites(authentication.getName(), pageable);
        return ResponseEntity.ok(response);
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/{tourId}/check")
    public ResponseEntity<Map<String, Boolean>> checkFavorite(
            @PathVariable UUID tourId,
            Authentication authentication) {
        boolean favorited = favoriteService.isFavorited(authentication.getName(), tourId);
        return ResponseEntity.ok(Map.of("favorited", favorited));
    }
}
