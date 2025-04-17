package com.application.based.entity;

import com.application.based.model.RequestStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String bookName;
    private String authorName;
    private String isbn;
    private Long quantity;

    @ManyToMany
    @JoinTable(
            name = "book_request_requesters",
            joinColumns = @JoinColumn(name = "book_request_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    @Builder.Default
    private Set<User> requesters = new HashSet<>();

    private String additionalNotes;

    @Enumerated(EnumType.STRING)
    private RequestStatus status;
}