package com.meetlocalguide.platform.modules.admin.infrastructure;

import com.meetlocalguide.platform.modules.admin.domain.AuditLog;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuditLogRepository extends JpaRepository<AuditLog, UUID> {
}
