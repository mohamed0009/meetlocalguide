package com.meetlocalguide.platform.modules.user.infrastructure;

import com.meetlocalguide.platform.modules.user.domain.UserProfile;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserProfileRepository extends JpaRepository<UserProfile, UUID> {

    Optional<UserProfile> findByUserAccountEmailIgnoreCase(String email);
}