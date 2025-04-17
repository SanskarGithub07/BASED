package com.application.based.service;

import com.application.based.entity.BookRequest;
import com.application.based.entity.User;
import com.application.based.model.BookRequestModel;
import com.application.based.model.EmailModel;
import com.application.based.model.RequestStatus;
import com.application.based.repository.BookRepository;
import com.application.based.repository.BookRequestRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Optional;

@Service
public class BookRequestServiceImpl implements BookRequestService {

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private BookRequestRepository bookRequestRepository;

    @Autowired
    private EmailService emailService;

    @Override
    @Transactional
    public String handleBookRequest(BookRequestModel model, User user) {
        if (bookRepository.findByIsbn(model.getIsbn()).isPresent()) {
            return "Book already exists in the system.";
        }

        Optional<BookRequest> existingRequest = bookRequestRepository.findByIsbn(model.getIsbn());
        BookRequest bookRequest;

        if (existingRequest.isPresent()) {
            bookRequest = existingRequest.get();
            if (bookRequest.getRequesters().contains(user)) {
                return "You've already requested this book.";
            }
        } else {
            bookRequest = BookRequest.builder()
                    .bookName(model.getBookName())
                    .authorName(model.getAuthorName())
                    .isbn(model.getIsbn())
                    .quantity(model.getQuantity())
                    .additionalNotes(model.getAdditionalNotes())
                    .status(RequestStatus.PENDING)
                    .requesters(new HashSet<>())
                    .build();
        }

        bookRequest.getRequesters().add(user);
        bookRequestRepository.save(bookRequest);
        return "Your book request has been submitted successfully.";
    }

    @Override
    @Transactional
    public String updateRequestStatus(Long requestId, RequestStatus newStatus) {
        BookRequest request = bookRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if (request.getStatus() != newStatus) {
            request.setStatus(newStatus);
            bookRequestRepository.save(request);

            request.getRequesters().forEach(user ->
                                                    sendStatusUpdateEmail(user, request, newStatus)
            );
            return "Status updated. Notifications sent to " + request.getRequesters().size() + " users.";
        }
        return "No status change detected.";
    }

    private void sendStatusUpdateEmail(User user, BookRequest request, RequestStatus newStatus) {
        EmailModel email = new EmailModel();
        email.setRecipient(user.getEmail());
        email.setSubject("Book Request Update: " + request.getBookName());

        String statusMessage = newStatus == RequestStatus.ADDED
                ? "The book is now available in the shop!"
                : "Contact us for further details.";

        String message = String.format(
                "Dear %s,\n\n" +
                        "Your request for '%s' (ISBN: %s) has been updated to %s.\n" +
                        "%s\n\n" +
                        "Thank you,\nBASED",
                user.getUsername(),
                request.getBookName(),
                request.getIsbn(),
                newStatus.toString().toLowerCase(),
                statusMessage
        );

        email.setMsgBody(message);
        emailService.sendSimpleMail(email);
    }
}