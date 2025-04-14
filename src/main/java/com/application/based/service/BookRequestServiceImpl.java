package com.application.based.service;

import com.application.based.entity.BookRequest;
import com.application.based.entity.User;
import com.application.based.model.BookRequestModel;
import com.application.based.model.RequestStatus;
import com.application.based.repository.BookRepository;
import com.application.based.repository.BookRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class BookRequestServiceImpl implements BookRequestService {

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private BookRequestRepository bookRequestRepository;

    @Override
    public String handleBookRequest(BookRequestModel model, User user) {
        if (bookRepository.findByIsbn(model.getIsbn()).isPresent()) {
            return "Book already exists in the system.";
        }

        if (bookRequestRepository.existsByIsbn(model.getIsbn())) {
            return "Book has already been requested. Working on it!";
        }

        BookRequest bookRequest = BookRequest.builder()
                .bookName(model.getBookName())
                .authorName(model.getAuthorName())
                .isbn(model.getIsbn())
                .quantity(model.getQuantity())
                .requesterName(user.getUsername())
                .requesterEmail(user.getEmail())
                .additionalNotes(model.getAdditionalNotes())
                .status(RequestStatus.PENDING)
                .build();

        bookRequestRepository.save(bookRequest);
        return "Your book request has been submitted successfully.";
    }
}
