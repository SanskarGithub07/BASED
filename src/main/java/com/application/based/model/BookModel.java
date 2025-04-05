package com.application.based.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookModel {
    private Long isbn;
    private String authorName;
    private String bookName;
    private Double price;
    private Long quantity;
    private LocalDate publicationYear;

}
