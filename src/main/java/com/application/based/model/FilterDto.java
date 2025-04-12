package com.application.based.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FilterDto {
    private String isbnNumber;
    private String authorName;
    private String bookName;
    private Double minPrice;
    private Double maxPrice;
    private String availability;
    private String publisherName;
    private Integer publicationYear;
}
