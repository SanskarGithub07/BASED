package com.application.based.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookOutDto {

    private Long id;

    private String isbn;

    private String authorName;

    private String bookName;

    private Double price;

    private Long quantity;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate publicationYear;

    private String availability;

    private String publisher;

    private String imageUrl;

    private String genre;
}
