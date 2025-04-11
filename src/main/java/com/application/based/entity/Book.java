package com.application.based.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@Entity
@Table(name = "books")
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "book_sequence")
    @SequenceGenerator(name = "book_sequence", sequenceName = "book_sequence", allocationSize = 1)
    private Long id;

    @Column(unique = true, nullable = false, length = 20)
    private String isbn;

    @Column(length = 255, nullable = false)
    private String authorName;

    @Column(length = 255, nullable = false)
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
