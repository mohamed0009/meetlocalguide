package com.meetlocalguide.platform.modules.admin.application;

import com.meetlocalguide.platform.modules.admin.domain.AuditLog;
import com.meetlocalguide.platform.modules.admin.infrastructure.AuditLogRepository;
import com.meetlocalguide.platform.modules.user.domain.UserAccount;
import com.meetlocalguide.platform.modules.user.infrastructure.UserAccountRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;
    private final UserAccountRepository userAccountRepository;

    @Transactional
    public void log(String actorEmail, String action, String targetType, String targetId, String detail, HttpServletRequest request) {
        AuditLog auditLog = new AuditLog();
        UserAccount actor = actorEmail == null ? null : userAccountRepository.findByEmailIgnoreCase(actorEmail).orElse(null);
        auditLog.setActor(actor);
        auditLog.setAction(action);
        auditLog.setTargetType(targetType);
        auditLog.setTargetId(targetId);
        auditLog.setDetail(detail);
        if (request != null) {
            auditLog.setIpAddress(request.getRemoteAddr());
            auditLog.setUserAgent(request.getHeader("User-Agent"));
        }
        auditLogRepository.save(auditLog);
    }
}
