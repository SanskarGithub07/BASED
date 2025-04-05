package com.application.based.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Date;
import java.util.Set;

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

    @Column(unique = true, nullable = false)
    private Long isbn;

    @Column(length = 60, nullable = false)
    private String author;

    @Column(length = 60, nullable = false)
    private String bookname;

    private Double price;

    private Long quantity;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate publicationYear;


}

