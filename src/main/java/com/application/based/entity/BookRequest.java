package com.application.based.entity;

import com.application.based.model.RequestStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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
    private String requesterName;
    private String requesterEmail;
    private String additionalNotes;

    @Enumerated(EnumType.STRING)
    private RequestStatus status;
}