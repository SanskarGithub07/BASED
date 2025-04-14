package com.application.based.model.cart;

import com.application.based.entity.Book;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CartItemDto {
    private Long id;
    private @NotNull Long quantity;
    private @NotNull Book book;
}
