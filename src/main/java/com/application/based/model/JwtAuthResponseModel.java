package com.application.based.model;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class JwtAuthResponseModel {
    private String accessToken;
    private String tokenType;
}
