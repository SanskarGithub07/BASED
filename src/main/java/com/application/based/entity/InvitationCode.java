package com.application.based.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "invitation_codes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InvitationCode {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 50)
    private String code;

    @Column(nullable = false, length = 20)
    private String roleType;

    @Column(name = "expiration_date")
    private LocalDateTime expirationDate;

    @Column(nullable = false)
    @Builder.Default
    private boolean used = false;

    @Column(name = "max_uses", nullable = false)
    @Builder.Default
    private int maxUses = 999;
//    change max uses to 1 or whatever required

    @Column(name = "use_count", nullable = false)
    @Builder.Default
    private int useCount = 0;

    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    public boolean isExpired() {
        return expirationDate != null && LocalDateTime.now().isAfter(expirationDate);
    }

    public boolean hasUsesRemaining() {
        return maxUses == 0 || useCount < maxUses;
    }

    public void incrementUseCount() {
        this.useCount++;
        if (this.maxUses > 0 && this.useCount >= this.maxUses) {
            this.used = true;
        }
    }
}
