package com.meetlocalguide.platform.modules.admin.domain;

import com.meetlocalguide.platform.common.domain.BaseEntity;
import com.meetlocalguide.platform.modules.user.domain.UserAccount;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "audit_logs")
public class AuditLog extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "actor_user_id", foreignKey = @ForeignKey(name = "fk_audit_logs_actor"))
    private UserAccount actor;

    @Column(name = "action", nullable = false, length = 120)
    private String action;

    @Column(name = "target_type", nullable = false, length = 120)
    private String targetType;

    @Column(name = "target_id", length = 120)
    private String targetId;

    @Column(name = "detail", length = 2000)
    private String detail;

    @Column(name = "ip_address", length = 64)
    private String ipAddress;

    @Column(name = "user_agent", length = 512)
    private String userAgent;
}
