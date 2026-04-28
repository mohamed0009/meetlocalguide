package com.meetlocalguide.platform.modules.favorite.application;

import com.meetlocalguide.platform.common.exception.AppException;
import com.meetlocalguide.platform.modules.favorite.api.dto.FavoriteResponse;
import com.meetlocalguide.platform.modules.favorite.domain.Favorite;
import com.meetlocalguide.platform.modules.favorite.infrastructure.FavoriteRepository;
import com.meetlocalguide.platform.modules.tour.domain.Tour;
import com.meetlocalguide.platform.modules.tour.infrastructure.TourRepository;
import com.meetlocalguide.platform.modules.user.domain.UserAccount;
import com.meetlocalguide.platform.modules.user.infrastructure.UserAccountRepository;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final TourRepository tourRepository;
    private final UserAccountRepository userAccountRepository;

    @Transactional
    public FavoriteResponse addFavorite(String userEmail, UUID tourId) {
        if (favoriteRepository.existsByUserEmailAndTourId(userEmail, tourId)) {
            throw new AppException(HttpStatus.CONFLICT, "ALREADY_FAVORITED", "Tour is already in your favorites.");
        }

        UserAccount user = userAccountRepository.findByEmailIgnoreCase(userEmail)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "USER_NOT_FOUND", "User account was not found."));

        Tour tour = tourRepository.findById(tourId)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "TOUR_NOT_FOUND", "Tour was not found."));

        Favorite favorite = new Favorite();
        favorite.setUser(user);
        favorite.setTour(tour);

        Favorite saved = favoriteRepository.save(favorite);
        return toResponse(saved);
    }

    @Transactional
    public void removeFavorite(String userEmail, UUID tourId) {
        int deleted = favoriteRepository.deleteByUserEmailAndTourId(userEmail, tourId);
        if (deleted == 0) {
            throw new AppException(HttpStatus.NOT_FOUND, "FAVORITE_NOT_FOUND", "Favorite not found.");
        }
    }

    @Transactional(readOnly = true)
    public Page<FavoriteResponse> listMyFavorites(String userEmail, Pageable pageable) {
        return favoriteRepository.findByUserEmail(userEmail, pageable).map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public boolean isFavorited(String userEmail, UUID tourId) {
        return favoriteRepository.existsByUserEmailAndTourId(userEmail, tourId);
    }

    private FavoriteResponse toResponse(Favorite f) {
        Tour t = f.getTour();
        return new FavoriteResponse(
                f.getId(),
                t.getId(),
                t.getSlug(),
                t.getTitle(),
                t.getShortDescription(),
                t.getCity(),
                t.getDurationMinutes(),
                t.getBasePriceAmount(),
                t.getBaseCurrency(),
                t.getAverageRating(),
                t.getTotalReviews(),
                f.getCreatedAt());
    }
}
