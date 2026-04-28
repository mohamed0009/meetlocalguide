package com.meetlocalguide.platform.modules.auth.infrastructure;

import com.meetlocalguide.platform.modules.auth.domain.EmailVerificationToken;
import com.meetlocalguide.platform.modules.user.domain.UserAccount;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmailVerificationTokenRepository extends JpaRepository<EmailVerificationToken, UUID> {

    Optional<EmailVerificationToken> findByTokenHashAndConsumedAtIsNull(String tokenHash);

    void deleteByUserAccount(UserAccount userAccount);
}
