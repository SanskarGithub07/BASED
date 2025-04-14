package com.application.based.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

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

    @JsonIgnore
    @OneToMany(fetch = FetchType.LAZY, mappedBy = "book")
    private List<Cart> carts;
}
