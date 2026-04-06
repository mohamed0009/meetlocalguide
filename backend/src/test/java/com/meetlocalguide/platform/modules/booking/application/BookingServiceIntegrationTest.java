package com.meetlocalguide.platform.modules.booking.application;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.meetlocalguide.platform.common.domain.CurrencyCode;
import com.meetlocalguide.platform.common.domain.SupportedLocale;
import com.meetlocalguide.platform.common.exception.AppException;
import com.meetlocalguide.platform.modules.booking.api.dto.BookingResponse;
import com.meetlocalguide.platform.modules.booking.api.dto.BookingStatusUpdateRequest;
import com.meetlocalguide.platform.modules.booking.api.dto.CreateBookingRequest;
import com.meetlocalguide.platform.modules.booking.domain.Booking;
import com.meetlocalguide.platform.modules.booking.domain.BookingStatus;
import com.meetlocalguide.platform.modules.booking.infrastructure.BookingRepository;
import com.meetlocalguide.platform.modules.guide.domain.GuideProfile;
import com.meetlocalguide.platform.modules.guide.domain.GuideVerificationStatus;
import com.meetlocalguide.platform.modules.guide.infrastructure.GuideProfileRepository;
import com.meetlocalguide.platform.modules.tour.domain.Tour;
import com.meetlocalguide.platform.modules.tour.domain.TourStatus;
import com.meetlocalguide.platform.modules.tour.infrastructure.TourRepository;
import com.meetlocalguide.platform.modules.user.domain.AccountStatus;
import com.meetlocalguide.platform.modules.user.domain.AuthProvider;
import com.meetlocalguide.platform.modules.user.domain.UserAccount;
import com.meetlocalguide.platform.modules.user.infrastructure.UserAccountRepository;
import com.meetlocalguide.platform.support.PostgresTestContainerSupport;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.Set;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;
import org.testcontainers.junit.jupiter.Testcontainers;

@SpringBootTest
@Testcontainers(disabledWithoutDocker = true)
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@ActiveProfiles("test")
@Transactional
class BookingServiceIntegrationTest extends PostgresTestContainerSupport {

    @Autowired
    private BookingService bookingService;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private TourRepository tourRepository;

    @Autowired
    private GuideProfileRepository guideProfileRepository;

    @Autowired
    private UserAccountRepository userAccountRepository;

    @Test
    void createBookingShouldCalculateTotalAndUseTourCurrencyWhenNullRequestedCurrency() {
        UserAccount traveler = createUser("traveler.integration@example.com");
        GuideProfile guide = createGuide("guide.integration@example.com", "guide-integration");
        Tour tour = createPublishedTour(guide, "atlas-day-trip", new BigDecimal("80.00"), 8);

        CreateBookingRequest request = new CreateBookingRequest(
                tour.getId(),
                Instant.parse("2030-03-10T09:00:00Z"),
                Instant.parse("2030-03-10T17:00:00Z"),
                3,
                null,
                "Window seat");

        BookingResponse response = bookingService.createBooking(traveler.getEmail(), request);

        assertThat(response.status()).isEqualTo("PENDING");
        assertThat(response.totalAmount()).isEqualByComparingTo("240.00");
        assertThat(response.currency()).isEqualTo(CurrencyCode.USD);
    }

    @Test
    void updateBookingStatusShouldBlockTransitionFromCompletedToCancelled() {
        UserAccount traveler = createUser("traveler.state@example.com");
        GuideProfile guide = createGuide("guide.state@example.com", "guide-state");
        Tour tour = createPublishedTour(guide, "chefchaouen-tour", new BigDecimal("60.00"), 10);
        Booking booking = createBooking(traveler, tour, BookingStatus.COMPLETED);

        assertThatThrownBy(() -> bookingService.updateBookingStatus(
                booking.getId(),
                guide.getUserAccount().getEmail(),
                false,
                new BookingStatusUpdateRequest(BookingStatus.CANCELLED)))
                .isInstanceOf(AppException.class)
                .satisfies(exception -> {
                    AppException appException = (AppException) exception;
                    assertThat(appException.getErrorCode()).isEqualTo("INVALID_BOOKING_TRANSITION");
                });
    }

    private UserAccount createUser(String email) {
        UserAccount user = new UserAccount();
        user.setEmail(email);
        user.setPasswordHash("bcrypt-hash-placeholder");
        user.setAuthProvider(AuthProvider.LOCAL);
        user.setAccountStatus(AccountStatus.ACTIVE);
        user.setEmailVerified(true);
        return userAccountRepository.save(user);
    }

    private GuideProfile createGuide(String email, String slug) {
        UserAccount guideUser = createUser(email);

        GuideProfile guide = new GuideProfile();
        guide.setUserAccount(guideUser);
        guide.setSlug(slug);
        guide.setBio("Professional guide.");
        guide.setYearsExperience(4);
        guide.setVerificationStatus(GuideVerificationStatus.VERIFIED);
        guide.setCity("Marrakech");
        guide.setCountry("Morocco");
        guide.setHourlyRateAmount(new BigDecimal("22.50"));
        guide.setLanguages(Set.of(SupportedLocale.EN, SupportedLocale.FR));
        return guideProfileRepository.save(guide);
    }

    private Tour createPublishedTour(GuideProfile guide, String slug, BigDecimal basePrice, int maxGroupSize) {
        Tour tour = new Tour();
        tour.setGuideProfile(guide);
        tour.setSlug(slug);
        tour.setTitle("Test Tour " + slug);
        tour.setDescription("Detailed itinerary.");
        tour.setCity("Marrakech");
        tour.setCountry("Morocco");
        tour.setDurationMinutes(360);
        tour.setMaxGroupSize(maxGroupSize);
        tour.setBasePriceAmount(basePrice);
        tour.setBaseCurrency(CurrencyCode.USD);
        tour.setStatus(TourStatus.PUBLISHED);
        return tourRepository.save(tour);
    }

    private Booking createBooking(UserAccount traveler, Tour tour, BookingStatus status) {
        Booking booking = new Booking();
        booking.setTraveler(traveler);
        booking.setTour(tour);
        booking.setStatus(status);
        booking.setStartAt(Instant.parse("2030-01-05T08:00:00Z"));
        booking.setEndAt(Instant.parse("2030-01-05T16:00:00Z"));
        booking.setParticipantCount(2);
        booking.setUnitPriceAmount(tour.getBasePriceAmount());
        booking.setTotalAmount(tour.getBasePriceAmount().multiply(new BigDecimal("2")));
        booking.setCurrency(CurrencyCode.USD);
        return bookingRepository.save(booking);
    }
}