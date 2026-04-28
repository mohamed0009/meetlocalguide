package com.meetlocalguide.platform.modules.guide.infrastructure;

import com.meetlocalguide.platform.modules.guide.domain.GuideProfile;
import com.meetlocalguide.platform.modules.guide.domain.GuideVerificationStatus;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface GuideProfileRepository extends JpaRepository<GuideProfile, UUID> {

    Optional<GuideProfile> findBySlug(String slug);

    Optional<GuideProfile> findByUserAccountEmailIgnoreCase(String email);

    long countByVerificationStatus(GuideVerificationStatus status);

    @Query("""
            select gp from GuideProfile gp
            where (:city is null or lower(gp.city) = lower(:city))
              and (:status is null or gp.verificationStatus = :status)
            """)
    Page<GuideProfile> search(
            @Param("city") String city,
            @Param("status") GuideVerificationStatus status,
            Pageable pageable);
}