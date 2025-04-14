package com.application.based.model;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookRequestModel {
    @NotBlank(message = "Book name is required")
    private String bookName;

    @NotBlank(message = "Author name is required")
    private String authorName;

    @Pattern(regexp = "^[0-9Xx\\-]{1,20}$", message = "Invalid ISBN format")
    private String isbn;

    private Long quantity;

    @NotBlank(message = "Requester name is required")
    private String requesterName;

    @Email(message = "Invalid email")
    private String requesterEmail;

    private String additionalNotes;
}
