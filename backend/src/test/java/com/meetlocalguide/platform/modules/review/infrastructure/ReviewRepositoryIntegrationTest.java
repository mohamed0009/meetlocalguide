package com.meetlocalguide.platform.modules.review.infrastructure;

import static org.assertj.core.api.Assertions.assertThat;

import com.meetlocalguide.platform.common.domain.CurrencyCode;
import com.meetlocalguide.platform.common.domain.SupportedLocale;
import com.meetlocalguide.platform.modules.booking.domain.Booking;
import com.meetlocalguide.platform.modules.booking.domain.BookingStatus;
import com.meetlocalguide.platform.modules.booking.infrastructure.BookingRepository;
import com.meetlocalguide.platform.modules.guide.domain.GuideProfile;
import com.meetlocalguide.platform.modules.guide.domain.GuideVerificationStatus;
import com.meetlocalguide.platform.modules.guide.infrastructure.GuideProfileRepository;
import com.meetlocalguide.platform.modules.review.domain.Review;
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
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.context.ActiveProfiles;
import org.testcontainers.junit.jupiter.Testcontainers;

@DataJpaTest
@Testcontainers(disabledWithoutDocker = true)
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@ActiveProfiles("test")
class ReviewRepositoryIntegrationTest extends PostgresTestContainerSupport {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private TourRepository tourRepository;

    @Autowired
    private GuideProfileRepository guideProfileRepository;

    @Autowired
    private UserAccountRepository userAccountRepository;

    @Test
    void findByTourIdAndVisibleTrueShouldReturnOnlyVisibleReviews() {
        UserAccount traveler = createUser("traveler@example.com");
        GuideProfile guide = createGuide("guide@example.com", "guide-review");
        Tour tour = createTour(guide, "sahara-tour");

        Booking booking1 = createBooking(traveler, tour, BookingStatus.COMPLETED,
                Instant.parse("2030-01-10T09:00:00Z"));
        Booking booking2 = createBooking(traveler, tour, BookingStatus.COMPLETED,
                Instant.parse("2030-01-12T09:00:00Z"));

        createReview(booking1, tour, traveler, 5, "Amazing experience", true);
        createReview(booking2, tour, traveler, 2, "Not great", false);

        Page<Review> visibleReviews = reviewRepository.findByTourIdAndVisibleTrue(tour.getId(), PageRequest.of(0, 10));

        assertThat(visibleReviews.getTotalElements()).isEqualTo(1);
        assertThat(visibleReviews.getContent().get(0).getRating()).isEqualTo(5);
        assertThat(visibleReviews.getContent().get(0).getComment()).isEqualTo("Amazing experience");
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
        guide.setBio("Certified guide.");
        guide.setYearsExperience(6);
        guide.setVerificationStatus(GuideVerificationStatus.VERIFIED);
        guide.setCity("Marrakech");
        guide.setCountry("Morocco");
        guide.setHourlyRateAmount(new BigDecimal("30.00"));
        guide.setLanguages(Set.of(SupportedLocale.EN, SupportedLocale.FR));
        return guideProfileRepository.save(guide);
    }

    private Tour createTour(GuideProfile guide, String slug) {
        Tour tour = new Tour();
        tour.setGuideProfile(guide);
        tour.setSlug(slug);
        tour.setTitle("Sahara Discovery");
        tour.setDescription("A two-day Sahara journey.");
        tour.setCity("Merzouga");
        tour.setCountry("Morocco");
        tour.setDurationMinutes(720);
        tour.setMaxGroupSize(12);
        tour.setBasePriceAmount(new BigDecimal("150.00"));
        tour.setBaseCurrency(CurrencyCode.USD);
        tour.setStatus(TourStatus.PUBLISHED);
        return tourRepository.save(tour);
    }

    private Booking createBooking(UserAccount traveler, Tour tour, BookingStatus status, Instant startAt) {
        Booking booking = new Booking();
        booking.setTraveler(traveler);
        booking.setTour(tour);
        booking.setStatus(status);
        booking.setStartAt(startAt);
        booking.setEndAt(startAt.plusSeconds(8 * 3600));
        booking.setParticipantCount(2);
        booking.setUnitPriceAmount(new BigDecimal("150.00"));
        booking.setTotalAmount(new BigDecimal("300.00"));
        booking.setCurrency(CurrencyCode.USD);
        return bookingRepository.save(booking);
    }

    private Review createReview(
            Booking booking,
            Tour tour,
            UserAccount author,
            int rating,
            String comment,
            boolean visible) {
        Review review = new Review();
        review.setBooking(booking);
        review.setTour(tour);
        review.setAuthor(author);
        review.setRating(rating);
        review.setComment(comment);
        review.setVisible(visible);
        return reviewRepository.save(review);
    }
}