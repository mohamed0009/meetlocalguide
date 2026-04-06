package com.meetlocalguide.platform.modules.auth.application;

import com.meetlocalguide.platform.modules.auth.domain.Role;
import com.meetlocalguide.platform.modules.auth.domain.RoleName;
import com.meetlocalguide.platform.modules.auth.infrastructure.RoleRepository;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
public class RoleSeeder implements ApplicationRunner {

    private final RoleRepository roleRepository;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        Map<RoleName, String> roleDescriptions = Map.of(
                RoleName.ROLE_USER, "Traveler user role",
                RoleName.ROLE_GUIDE, "Local guide role",
                RoleName.ROLE_ADMIN, "Platform administrator role");

        roleDescriptions.forEach((roleName, description) -> {
            if (roleRepository.findByName(roleName).isPresent()) {
                return;
            }

            Role role = new Role();
            role.setName(roleName);
            role.setDescription(description);
            roleRepository.save(role);
        });
    }
}