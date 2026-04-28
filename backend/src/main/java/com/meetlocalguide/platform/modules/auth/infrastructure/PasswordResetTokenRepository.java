package com.meetlocalguide.platform.modules.auth.infrastructure;

import com.meetlocalguide.platform.modules.auth.domain.PasswordResetToken;
import com.meetlocalguide.platform.modules.user.domain.UserAccount;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, UUID> {

    Optional<PasswordResetToken> findByTokenHashAndConsumedAtIsNull(String tokenHash);

    void deleteByUserAccount(UserAccount userAccount);
}
