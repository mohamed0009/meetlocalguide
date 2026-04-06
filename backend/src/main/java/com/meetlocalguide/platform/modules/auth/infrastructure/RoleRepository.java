package com.meetlocalguide.platform.modules.auth.infrastructure;

import com.meetlocalguide.platform.modules.auth.domain.Role;
import com.meetlocalguide.platform.modules.auth.domain.RoleName;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<Role, UUID> {

    Optional<Role> findByName(RoleName roleName);
}