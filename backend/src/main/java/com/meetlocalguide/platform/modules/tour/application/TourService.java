package com.meetlocalguide.platform.modules.tour.application;

import com.meetlocalguide.platform.common.exception.AppException;
import com.meetlocalguide.platform.modules.guide.domain.GuideProfile;
import com.meetlocalguide.platform.modules.guide.infrastructure.GuideProfileRepository;
import com.meetlocalguide.platform.modules.tour.api.dto.CreateTourRequest;
import com.meetlocalguide.platform.modules.tour.api.dto.TourDetailResponse;
import com.meetlocalguide.platform.modules.tour.api.dto.TourImageRequest;
import com.meetlocalguide.platform.modules.tour.api.dto.TourImageView;
import com.meetlocalguide.platform.modules.tour.api.dto.TourSummaryResponse;
import com.meetlocalguide.platform.modules.tour.api.dto.TourTranslationRequest;
import com.meetlocalguide.platform.modules.tour.api.dto.TourTranslationView;
import com.meetlocalguide.platform.modules.tour.api.dto.UpdateTourRequest;
import com.meetlocalguide.platform.modules.tour.domain.Tour;
import com.meetlocalguide.platform.modules.tour.domain.TourImage;
import com.meetlocalguide.platform.modules.tour.domain.TourStatus;
import com.meetlocalguide.platform.modules.tour.domain.TourTranslation;
import com.meetlocalguide.platform.modules.tour.infrastructure.TourRepository;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class TourService {

    private final TourRepository tourRepository;
    private final GuideProfileRepository guideProfileRepository;

    @Transactional(readOnly = true)
    @Cacheable(value = "tours-search", key = "T(java.util.Objects).hash(#city, #status, #minPrice, #maxPrice, #minDuration, #maxDuration, #title, #pageable.pageNumber, #pageable.pageSize, #pageable.sort.toString())")
    public Page<TourSummaryResponse> listTours(
            String city,
            TourStatus status,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            Integer minDuration,
            Integer maxDuration,
            String title,
            Pageable pageable) {
        TourStatus effectiveStatus = status == null ? TourStatus.PUBLISHED : status;
        return tourRepository
                .search(city, effectiveStatus, minPrice, maxPrice, minDuration, maxDuration, title, pageable)
                .map(this::toSummaryResponse);
    }

    @Transactional(readOnly = true)
    public TourDetailResponse getTourBySlug(String slug) {
        Tour tour = tourRepository.findBySlug(slug)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "TOUR_NOT_FOUND", "Tour was not found."));

        if (tour.getStatus() != TourStatus.PUBLISHED) {
            throw new AppException(HttpStatus.NOT_FOUND, "TOUR_NOT_FOUND", "Tour was not found.");
        }
        return toDetailResponse(tour);
    }

    @Transactional
    public TourDetailResponse createTour(String email, CreateTourRequest request) {
        GuideProfile guideProfile = guideProfileRepository.findByUserAccountEmailIgnoreCase(email)
                .orElseThrow(() -> new AppException(
                        HttpStatus.FORBIDDEN,
                        "GUIDE_PROFILE_REQUIRED",
                        "You must have a guide profile before creating a tour."));

        validateUniqueSlug(request.slug().trim().toLowerCase(), null);

        Tour tour = new Tour();
        tour.setGuideProfile(guideProfile);
        applyCommonFields(tour, request.slug(), request.title(), request.shortDescription(), request.description(),
                request.city(),
                request.region(), request.country(), request.meetingPoint(), request.latitude(), request.longitude(),
                request.durationMinutes(), request.maxGroupSize(), request.basePriceAmount(), request.baseCurrency(),
                request.featured());
        tour.setStatus(request.status() == null ? TourStatus.DRAFT : request.status());
        tour.setTags(normalizeTags(request.tags()));

        replaceImages(tour, request.images());
        replaceTranslations(tour, request.translations());

        Tour persisted = tourRepository.save(tour);
        return toDetailResponse(persisted);
    }

    @Transactional
    public TourDetailResponse updateTour(UUID tourId, String email, boolean isAdmin, UpdateTourRequest request) {
        Tour tour = findManagedTour(tourId, email, isAdmin);
        String normalizedSlug = request.slug().trim().toLowerCase();
        validateUniqueSlug(normalizedSlug, tour.getId());

        applyCommonFields(tour, request.slug(), request.title(), request.shortDescription(), request.description(),
                request.city(),
                request.region(), request.country(), request.meetingPoint(), request.latitude(), request.longitude(),
                request.durationMinutes(), request.maxGroupSize(), request.basePriceAmount(), request.baseCurrency(),
                request.featured());
        tour.setStatus(request.status());
        tour.setTags(normalizeTags(request.tags()));

        replaceImages(tour, request.images());
        replaceTranslations(tour, request.translations());

        Tour persisted = tourRepository.save(tour);
        return toDetailResponse(persisted);
    }

    @Transactional
    public void archiveTour(UUID tourId, String email, boolean isAdmin) {
        Tour tour = findManagedTour(tourId, email, isAdmin);
        tour.setStatus(TourStatus.ARCHIVED);
    }

    private Tour findManagedTour(UUID tourId, String email, boolean isAdmin) {
        if (isAdmin) {
            return tourRepository.findById(tourId)
                    .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "TOUR_NOT_FOUND", "Tour was not found."));
        }

        return tourRepository.findByIdAndGuideProfileUserAccountEmailIgnoreCase(tourId, email)
                .orElseThrow(() -> new AppException(
                        HttpStatus.FORBIDDEN,
                        "TOUR_ACCESS_DENIED",
                        "You do not have access to manage this tour."));
    }

    private void validateUniqueSlug(String slug, UUID currentTourId) {
        tourRepository.findBySlug(slug)
                .filter(existing -> currentTourId == null || !existing.getId().equals(currentTourId))
                .ifPresent(existing -> {
                    throw new AppException(HttpStatus.CONFLICT, "TOUR_SLUG_ALREADY_USED", "Tour slug is already used.");
                });
    }

    private void applyCommonFields(
            Tour tour,
            String slug,
            String title,
            String shortDescription,
            String description,
            String city,
            String region,
            String country,
            String meetingPoint,
            BigDecimal latitude,
            BigDecimal longitude,
            int durationMinutes,
            int maxGroupSize,
            BigDecimal basePriceAmount,
            com.meetlocalguide.platform.common.domain.CurrencyCode baseCurrency,
            Boolean featured) {
        tour.setSlug(slug.trim().toLowerCase());
        tour.setTitle(title.trim());
        tour.setShortDescription(shortDescription == null ? null : shortDescription.trim());
        tour.setDescription(description.trim());
        tour.setCity(city.trim());
        tour.setRegion(region == null ? null : region.trim());
        tour.setCountry(country.trim());
        tour.setMeetingPoint(meetingPoint == null ? null : meetingPoint.trim());
        tour.setLatitude(latitude);
        tour.setLongitude(longitude);
        tour.setDurationMinutes(durationMinutes);
        tour.setMaxGroupSize(maxGroupSize);
        tour.setBasePriceAmount(basePriceAmount);
        tour.setBaseCurrency(baseCurrency);
        if (featured != null) {
            tour.setFeatured(featured);
        }
    }

    private void replaceImages(Tour tour, List<TourImageRequest> imageRequests) {
        tour.getImages().clear();
        if (imageRequests == null || imageRequests.isEmpty()) {
            return;
        }

        List<TourImageRequest> sortedRequests = new ArrayList<>(imageRequests);
        sortedRequests.sort(Comparator.comparingInt(TourImageRequest::displayOrder));

        for (TourImageRequest imageRequest : sortedRequests) {
            TourImage image = new TourImage();
            image.setTour(tour);
            image.setImageUrl(imageRequest.imageUrl().trim());
            image.setAltText(imageRequest.altText() == null ? null : imageRequest.altText().trim());
            image.setDisplayOrder(imageRequest.displayOrder());
            image.setPrimary(imageRequest.isPrimary());
            tour.getImages().add(image);
        }
    }

    private void replaceTranslations(Tour tour, List<TourTranslationRequest> translationRequests) {
        tour.getTranslations().clear();
        if (translationRequests == null || translationRequests.isEmpty()) {
            return;
        }

        for (TourTranslationRequest translationRequest : translationRequests) {
            TourTranslation translation = new TourTranslation();
            translation.setTour(tour);
            translation.setLocale(translationRequest.locale());
            translation.setTitle(translationRequest.title().trim());
            translation.setDescription(translationRequest.description().trim());
            tour.getTranslations().add(translation);
        }
    }

    private Set<String> normalizeTags(Set<String> tags) {
        if (tags == null || tags.isEmpty()) {
            return new LinkedHashSet<>();
        }

        return tags.stream()
                .filter(tag -> tag != null && !tag.isBlank())
                .map(tag -> tag.trim().toLowerCase())
                .collect(java.util.stream.Collectors.toCollection(LinkedHashSet::new));
    }

    private TourSummaryResponse toSummaryResponse(Tour tour) {
        return new TourSummaryResponse(
                tour.getId(),
                tour.getSlug(),
                tour.getTitle(),
                tour.getShortDescription(),
                tour.getCity(),
                tour.getDurationMinutes(),
                tour.getBasePriceAmount(),
                tour.getBaseCurrency(),
                tour.getAverageRating(),
                tour.getTotalReviews(),
                tour.getGuideProfile().getSlug(),
                extractGuideDisplayName(tour));
    }

    private TourDetailResponse toDetailResponse(Tour tour) {
        List<TourImageView> images = tour.getImages().stream()
                .sorted(Comparator.comparingInt(TourImage::getDisplayOrder))
                .map(image -> new TourImageView(
                        image.getId(),
                        image.getImageUrl(),
                        image.getAltText(),
                        image.getDisplayOrder(),
                        image.isPrimary()))
                .toList();

        List<TourTranslationView> translations = tour.getTranslations().stream()
                .map(translation -> new TourTranslationView(
                        translation.getId(),
                        translation.getLocale(),
                        translation.getTitle(),
                        translation.getDescription()))
                .toList();

        return new TourDetailResponse(
                tour.getId(),
                tour.getSlug(),
                tour.getTitle(),
                tour.getShortDescription(),
                tour.getDescription(),
                tour.getCity(),
                tour.getRegion(),
                tour.getCountry(),
                tour.getMeetingPoint(),
                tour.getLatitude(),
                tour.getLongitude(),
                tour.getDurationMinutes(),
                tour.getMaxGroupSize(),
                tour.getBasePriceAmount(),
                tour.getBaseCurrency(),
                tour.getStatus().name(),
                tour.isFeatured(),
                tour.getAverageRating(),
                tour.getTotalReviews(),
                Set.copyOf(tour.getTags()),
                tour.getGuideProfile().getSlug(),
                extractGuideDisplayName(tour),
                images,
                translations);
    }

    private String extractGuideDisplayName(Tour tour) {
        if (tour.getGuideProfile().getUserAccount().getUserProfile() != null
                && tour.getGuideProfile().getUserAccount().getUserProfile().getDisplayName() != null
                && !tour.getGuideProfile().getUserAccount().getUserProfile().getDisplayName().isBlank()) {
            return tour.getGuideProfile().getUserAccount().getUserProfile().getDisplayName();
        }
        return tour.getGuideProfile().getUserAccount().getEmail().split("@")[0];
    }
}