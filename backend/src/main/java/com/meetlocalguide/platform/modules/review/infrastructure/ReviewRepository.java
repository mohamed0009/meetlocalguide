package com.meetlocalguide.platform.modules.review.infrastructure;

import com.meetlocalguide.platform.modules.review.domain.Review;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ReviewRepository extends JpaRepository<Review, UUID> {

    Optional<Review> findByBookingId(UUID bookingId);

    Page<Review> findByTourIdAndVisibleTrue(UUID tourId, Pageable pageable);

    @Query("""
            select r from Review r
            where lower(r.author.email) = lower(:email)
            """)
    Page<Review> findByAuthorEmail(@Param("email") String email, Pageable pageable);
}