package com.application.based.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class BookInDto {
    private String authorName;
    private String isbnNumber;
    private String bookName;
    private Integer page;
    private Integer size;
    private String sort;
    private Double minPrice;
    private Double maxPrice;
    private String availability;
    private String publisherName;
    private Integer publicationYear;
}
