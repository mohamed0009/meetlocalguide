package com.meetlocalguide.platform.modules.favorite.domain;

import com.meetlocalguide.platform.common.domain.BaseEntity;
import com.meetlocalguide.platform.modules.tour.domain.Tour;
import com.meetlocalguide.platform.modules.user.domain.UserAccount;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(
    name = "favorites",
    indexes = {
        @Index(name = "idx_favorites_user_id", columnList = "user_id"),
        @Index(name = "idx_favorites_tour_id", columnList = "tour_id")
    },
    uniqueConstraints = {
        @UniqueConstraint(name = "uk_favorites_user_tour", columnNames = {"user_id", "tour_id"})
    }
)
public class Favorite extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false, foreignKey = @ForeignKey(name = "fk_favorites_user"))
    private UserAccount user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "tour_id", nullable = false, foreignKey = @ForeignKey(name = "fk_favorites_tour"))
    private Tour tour;
}
