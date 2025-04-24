package com.application.based.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InvitationCodeDto {
    private String code;
    private String roleType;
    private LocalDateTime expirationDate;
    private int maxUses;
}