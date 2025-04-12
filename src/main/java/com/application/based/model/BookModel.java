package com.application.based.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookModel {
    private String isbn;
    private String authorName;
    private String bookName;
    private Double price;
    private Long quantity;
    private LocalDate publicationYear;
    private String availability;

}
