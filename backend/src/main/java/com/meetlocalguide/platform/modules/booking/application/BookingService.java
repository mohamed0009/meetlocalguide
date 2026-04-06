package com.meetlocalguide.platform.modules.booking.application;

import com.meetlocalguide.platform.common.domain.CurrencyCode;
import com.meetlocalguide.platform.common.exception.AppException;
import com.meetlocalguide.platform.modules.booking.api.dto.BookingResponse;
import com.meetlocalguide.platform.modules.booking.api.dto.BookingStatusUpdateRequest;
import com.meetlocalguide.platform.modules.booking.api.dto.CancelBookingRequest;
import com.meetlocalguide.platform.modules.booking.api.dto.CreateBookingRequest;
import com.meetlocalguide.platform.modules.booking.domain.Booking;
import com.meetlocalguide.platform.modules.booking.domain.BookingStatus;
import com.meetlocalguide.platform.modules.booking.infrastructure.BookingRepository;
import com.meetlocalguide.platform.modules.tour.domain.Tour;
import com.meetlocalguide.platform.modules.tour.domain.TourStatus;
import com.meetlocalguide.platform.modules.tour.infrastructure.TourRepository;
import com.meetlocalguide.platform.modules.user.domain.UserAccount;
import com.meetlocalguide.platform.modules.user.infrastructure.UserAccountRepository;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final TourRepository tourRepository;
    private final UserAccountRepository userAccountRepository;

    @Transactional
    public BookingResponse createBooking(String travelerEmail, CreateBookingRequest request) {
        UserAccount traveler = userAccountRepository.findByEmailIgnoreCase(travelerEmail)
                .orElseThrow(
                        () -> new AppException(HttpStatus.NOT_FOUND, "USER_NOT_FOUND", "User account was not found."));

        Tour tour = tourRepository.findById(request.tourId())
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "TOUR_NOT_FOUND", "Tour was not found."));

        if (tour.getStatus() != TourStatus.PUBLISHED) {
            throw new AppException(HttpStatus.BAD_REQUEST, "TOUR_NOT_BOOKABLE", "Tour is not available for booking.");
        }

        if (!request.startAt().isBefore(request.endAt())) {
            throw new AppException(HttpStatus.BAD_REQUEST, "INVALID_BOOKING_RANGE",
                    "Booking start must be before end.");
        }

        if (request.participantCount() > tour.getMaxGroupSize()) {
            throw new AppException(
                    HttpStatus.BAD_REQUEST,
                    "PARTICIPANTS_EXCEED_LIMIT",
                    "Participant count exceeds maximum allowed group size.");
        }

        Booking booking = new Booking();
        booking.setTraveler(traveler);
        booking.setTour(tour);
        booking.setStatus(BookingStatus.PENDING);
        booking.setStartAt(request.startAt());
        booking.setEndAt(request.endAt());
        booking.setParticipantCount(request.participantCount());
        booking.setUnitPriceAmount(tour.getBasePriceAmount());
        booking.setTotalAmount(tour.getBasePriceAmount().multiply(BigDecimal.valueOf(request.participantCount())));
        booking.setCurrency(resolveBookingCurrency(request.currency(), tour.getBaseCurrency()));
        booking.setSpecialRequests(request.specialRequests() == null ? null : request.specialRequests().trim());

        Booking persisted = bookingRepository.save(booking);
        return toResponse(persisted);
    }

    @Transactional(readOnly = true)
    public Page<BookingResponse> listMyBookings(String travelerEmail, Pageable pageable) {
        return bookingRepository.findByTravelerEmail(travelerEmail, pageable)
                .map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public BookingResponse getBooking(UUID bookingId, String userEmail, boolean isAdmin, boolean isGuide) {
        Booking booking = findAccessibleBooking(bookingId, userEmail, isAdmin, isGuide);
        return toResponse(booking);
    }

    @Transactional
    public BookingResponse cancelBooking(
            UUID bookingId,
            String userEmail,
            boolean isAdmin,
            CancelBookingRequest request) {
        Booking booking = isAdmin
                ? bookingRepository.findById(bookingId).orElseThrow(() -> notFoundBooking())
                : bookingRepository.findByIdAndTravelerEmail(bookingId, userEmail)
                        .orElseThrow(() -> accessDeniedBooking());

        if (booking.getStatus() == BookingStatus.COMPLETED) {
            throw new AppException(HttpStatus.BAD_REQUEST, "BOOKING_ALREADY_COMPLETED",
                    "Completed booking cannot be cancelled.");
        }
        if (booking.getStatus() == BookingStatus.CANCELLED) {
            return toResponse(booking);
        }

        booking.setStatus(BookingStatus.CANCELLED);
        booking.setCancellationReason(request == null || request.reason() == null ? null : request.reason().trim());
        booking.setCancelledAt(Instant.now());
        return toResponse(booking);
    }

    @Transactional
    public BookingResponse updateBookingStatus(
            UUID bookingId,
            String userEmail,
            boolean isAdmin,
            BookingStatusUpdateRequest request) {
        Booking booking = isAdmin
                ? bookingRepository.findById(bookingId).orElseThrow(() -> notFoundBooking())
                : bookingRepository.findByIdAndGuideEmail(bookingId, userEmail)
                        .orElseThrow(() -> accessDeniedBooking());

        BookingStatus current = booking.getStatus();
        BookingStatus target = request.status();
        validateTransition(current, target);

        booking.setStatus(target);
        if (target == BookingStatus.CANCELLED) {
            booking.setCancelledAt(Instant.now());
        }
        return toResponse(booking);
    }

    private Booking findAccessibleBooking(UUID bookingId, String userEmail, boolean isAdmin, boolean isGuide) {
        if (isAdmin) {
            return bookingRepository.findById(bookingId)
                    .orElseThrow(this::notFoundBooking);
        }

        return bookingRepository.findByIdAndTravelerEmail(bookingId, userEmail)
                .or(() -> isGuide ? bookingRepository.findByIdAndGuideEmail(bookingId, userEmail)
                        : java.util.Optional.empty())
                .orElseThrow(this::accessDeniedBooking);
    }

    private void validateTransition(BookingStatus current, BookingStatus target) {
        if (current == target) {
            return;
        }
        if (current == BookingStatus.CANCELLED || current == BookingStatus.COMPLETED) {
            throw new AppException(HttpStatus.BAD_REQUEST, "INVALID_BOOKING_TRANSITION",
                    "Booking status cannot be changed anymore.");
        }

        boolean valid = switch (current) {
            case PENDING -> target == BookingStatus.CONFIRMED || target == BookingStatus.CANCELLED;
            case CONFIRMED -> target == BookingStatus.COMPLETED || target == BookingStatus.CANCELLED;
            default -> false;
        };

        if (!valid) {
            throw new AppException(HttpStatus.BAD_REQUEST, "INVALID_BOOKING_TRANSITION",
                    "Requested booking status transition is invalid.");
        }
    }

    private CurrencyCode resolveBookingCurrency(CurrencyCode requestedCurrency, CurrencyCode baseCurrency) {
        return requestedCurrency == null ? baseCurrency : requestedCurrency;
    }

    private BookingResponse toResponse(Booking booking) {
        return new BookingResponse(
                booking.getId(),
                booking.getStatus().name(),
                booking.getTraveler().getId(),
                booking.getTraveler().getEmail(),
                booking.getTour().getId(),
                booking.getTour().getSlug(),
                booking.getTour().getTitle(),
                booking.getStartAt(),
                booking.getEndAt(),
                booking.getParticipantCount(),
                booking.getUnitPriceAmount(),
                booking.getTotalAmount(),
                booking.getCurrency(),
                booking.getSpecialRequests(),
                booking.getCancellationReason(),
                booking.getCancelledAt(),
                booking.getCreatedAt());
    }

    private AppException notFoundBooking() {
        return new AppException(HttpStatus.NOT_FOUND, "BOOKING_NOT_FOUND", "Booking was not found.");
    }

    private AppException accessDeniedBooking() {
        return new AppException(HttpStatus.FORBIDDEN, "BOOKING_ACCESS_DENIED",
                "You do not have access to this booking.");
    }
}