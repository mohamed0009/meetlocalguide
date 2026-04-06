package com.meetlocalguide.platform.modules.booking.infrastructure;

import com.meetlocalguide.platform.modules.booking.domain.Booking;
import com.meetlocalguide.platform.modules.booking.domain.BookingStatus;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface BookingRepository extends JpaRepository<Booking, UUID> {

    @Query("""
            select b from Booking b
            where lower(b.traveler.email) = lower(:email)
            """)
    Page<Booking> findByTravelerEmail(@Param("email") String email, Pageable pageable);

    @Query("""
            select b from Booking b
            where b.id = :bookingId
              and lower(b.tour.guideProfile.userAccount.email) = lower(:email)
            """)
    Optional<Booking> findByIdAndGuideEmail(@Param("bookingId") UUID bookingId, @Param("email") String email);

    @Query("""
            select b from Booking b
            where b.id = :bookingId
              and lower(b.traveler.email) = lower(:email)
            """)
    Optional<Booking> findByIdAndTravelerEmail(@Param("bookingId") UUID bookingId, @Param("email") String email);

    long countByTourIdAndStatus(UUID tourId, BookingStatus status);
}