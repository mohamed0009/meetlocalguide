package com.meetlocalguide.platform.modules.favorite.infrastructure;

import com.meetlocalguide.platform.modules.favorite.domain.Favorite;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface FavoriteRepository extends JpaRepository<Favorite, UUID> {

    @Query("select f from Favorite f where lower(f.user.email) = lower(:email) order by f.createdAt desc")
    Page<Favorite> findByUserEmail(@Param("email") String email, Pageable pageable);

    @Query("select count(f) > 0 from Favorite f where lower(f.user.email) = lower(:email) and f.tour.id = :tourId")
    boolean existsByUserEmailAndTourId(@Param("email") String email, @Param("tourId") UUID tourId);

    @Modifying
    @Query("delete from Favorite f where lower(f.user.email) = lower(:email) and f.tour.id = :tourId")
    int deleteByUserEmailAndTourId(@Param("email") String email, @Param("tourId") UUID tourId);
}
