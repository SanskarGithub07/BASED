package com.application.based.model.cart;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AddToCartDto {
    private Integer id;
    private @NotNull String bookIsbn;
    private @NotNull Integer quantity;
}
