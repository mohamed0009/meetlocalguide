package com.meetlocalguide.platform.modules.tour.infrastructure;

import static org.assertj.core.api.Assertions.assertThat;

import com.meetlocalguide.platform.common.domain.CurrencyCode;
import com.meetlocalguide.platform.common.domain.SupportedLocale;
import com.meetlocalguide.platform.modules.guide.domain.GuideProfile;
import com.meetlocalguide.platform.modules.guide.domain.GuideVerificationStatus;
import com.meetlocalguide.platform.modules.guide.infrastructure.GuideProfileRepository;
import com.meetlocalguide.platform.modules.tour.domain.Tour;
import com.meetlocalguide.platform.modules.tour.domain.TourStatus;
import com.meetlocalguide.platform.modules.user.domain.AccountStatus;
import com.meetlocalguide.platform.modules.user.domain.AuthProvider;
import com.meetlocalguide.platform.modules.user.domain.UserAccount;
import com.meetlocalguide.platform.modules.user.infrastructure.UserAccountRepository;
import com.meetlocalguide.platform.support.PostgresTestContainerSupport;
import java.math.BigDecimal;
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
class TourRepositoryIntegrationTest extends PostgresTestContainerSupport {

    @Autowired
    private TourRepository tourRepository;

    @Autowired
    private GuideProfileRepository guideProfileRepository;

    @Autowired
    private UserAccountRepository userAccountRepository;

    @Test
    void searchShouldFilterByCityStatusPriceDurationAndTitle() {
        GuideProfile guide = createGuide("guide1@example.com", "guide-one");

        createTour(guide, "marrakech-desert-tour", "Marrakech Desert Adventure", "Marrakech", 95.00, 480,
                TourStatus.PUBLISHED);
        createTour(guide, "marrakech-city-tour", "Marrakech City Walk", "Marrakech", 35.00, 120, TourStatus.PUBLISHED);
        createTour(guide, "fes-desert-tour", "Fes Desert Escape", "Fes", 120.00, 600, TourStatus.PUBLISHED);
        createTour(guide, "draft-tour", "Draft Tour", "Marrakech", 70.00, 240, TourStatus.DRAFT);

        Page<Tour> results = tourRepository.search(
                "Marrakech",
                TourStatus.PUBLISHED,
                new BigDecimal("50.00"),
                new BigDecimal("100.00"),
                300,
                600,
                "desert",
                PageRequest.of(0, 10));

        assertThat(results.getTotalElements()).isEqualTo(1);
        assertThat(results.getContent().get(0).getSlug()).isEqualTo("marrakech-desert-tour");
    }

    private GuideProfile createGuide(String email, String slug) {
        UserAccount user = new UserAccount();
        user.setEmail(email);
        user.setPasswordHash("bcrypt-hash-placeholder");
        user.setAuthProvider(AuthProvider.LOCAL);
        user.setAccountStatus(AccountStatus.ACTIVE);
        user.setEmailVerified(true);
        UserAccount persistedUser = userAccountRepository.save(user);

        GuideProfile guide = new GuideProfile();
        guide.setUserAccount(persistedUser);
        guide.setSlug(slug);
        guide.setBio("Experienced local guide in Morocco.");
        guide.setYearsExperience(7);
        guide.setVerificationStatus(GuideVerificationStatus.VERIFIED);
        guide.setCity("Marrakech");
        guide.setCountry("Morocco");
        guide.setHourlyRateAmount(new BigDecimal("25.00"));
        guide.setLanguages(Set.of(SupportedLocale.EN, SupportedLocale.FR));
        return guideProfileRepository.save(guide);
    }

    private Tour createTour(
            GuideProfile guide,
            String slug,
            String title,
            String city,
            double price,
            int durationMinutes,
            TourStatus status) {
        Tour tour = new Tour();
        tour.setGuideProfile(guide);
        tour.setSlug(slug);
        tour.setTitle(title);
        tour.setDescription("Detailed itinerary and highlights.");
        tour.setCity(city);
        tour.setCountry("Morocco");
        tour.setDurationMinutes(durationMinutes);
        tour.setMaxGroupSize(10);
        tour.setBasePriceAmount(BigDecimal.valueOf(price));
        tour.setBaseCurrency(CurrencyCode.USD);
        tour.setStatus(status);
        tour.getTags().add("desert");
        return tourRepository.save(tour);
    }
}