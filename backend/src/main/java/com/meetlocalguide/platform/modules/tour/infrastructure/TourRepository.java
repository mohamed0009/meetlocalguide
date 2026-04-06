package com.meetlocalguide.platform.modules.tour.infrastructure;

import com.meetlocalguide.platform.modules.tour.domain.Tour;
import com.meetlocalguide.platform.modules.tour.domain.TourStatus;
import java.math.BigDecimal;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TourRepository extends JpaRepository<Tour, UUID> {

    Optional<Tour> findBySlug(String slug);

    Optional<Tour> findByIdAndGuideProfileUserAccountEmailIgnoreCase(UUID id, String email);

    @Query("""
            select t from Tour t
            where (:city is null or lower(t.city) = lower(:city))
              and (:status is null or t.status = :status)
              and (:minPrice is null or t.basePriceAmount >= :minPrice)
              and (:maxPrice is null or t.basePriceAmount <= :maxPrice)
              and (:minDuration is null or t.durationMinutes >= :minDuration)
              and (:maxDuration is null or t.durationMinutes <= :maxDuration)
              and (:title is null or lower(t.title) like lower(concat('%', :title, '%')))
            """)
    Page<Tour> search(
            @Param("city") String city,
            @Param("status") TourStatus status,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            @Param("minDuration") Integer minDuration,
            @Param("maxDuration") Integer maxDuration,
            @Param("title") String title,
            Pageable pageable);
}