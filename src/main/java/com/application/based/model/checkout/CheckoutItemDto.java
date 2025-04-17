package com.application.based.model.checkout;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CheckoutItemDto {
    private String bookName;
    private Long quantity;
    private Double price;
    private Long bookId;
    private Long userId;
}
