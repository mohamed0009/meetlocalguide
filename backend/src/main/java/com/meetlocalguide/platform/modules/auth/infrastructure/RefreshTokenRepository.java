package com.meetlocalguide.platform.modules.auth.infrastructure;

import com.meetlocalguide.platform.modules.auth.domain.RefreshToken;
import com.meetlocalguide.platform.modules.user.domain.UserAccount;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, UUID> {

    Optional<RefreshToken> findByTokenHashAndRevokedFalse(String tokenHash);

    List<RefreshToken> findAllByUserAccountAndRevokedFalse(UserAccount userAccount);

    void deleteByUserAccount(UserAccount userAccount);
}