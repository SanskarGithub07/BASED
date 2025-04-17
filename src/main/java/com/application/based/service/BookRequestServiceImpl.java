package com.application.based.service;

import com.application.based.entity.BookRequest;
import com.application.based.entity.User;
import com.application.based.model.BookRequestModel;
import com.application.based.model.EmailModel;
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

    @Autowired
    private EmailService emailService;

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

    @Override
    public String updateRequestStatus(Long requestId, RequestStatus newStatus) {
        BookRequest request = bookRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if (request.getStatus() != newStatus) {
            RequestStatus previousStatus = request.getStatus();
            request.setStatus(newStatus);
            bookRequestRepository.save(request);

            sendStatusUpdateEmail(request, previousStatus, newStatus);
            return "Status updated and email sent.";
        }
        return "No status change detected.";
    }

    private void sendStatusUpdateEmail(BookRequest request, RequestStatus previousStatus, RequestStatus newStatus) {
        EmailModel email = new EmailModel();
        email.setRecipient(request.getRequesterEmail());
        email.setSubject("Book Request Update: " + request.getBookName());

        String statusMessage = newStatus == RequestStatus.ADDED
                ? "The book is now available in the shop!"
                : "Contact us for further details.";

        String message = String.format(
                "Dear %s,\n\n" +
                        "Your request for '%s' (ISBN: %s) has been updated from %s to %s.\n" +
                        "%s\n\n" +
                        "Thank you,\nBASED",
                request.getRequesterName(),
                request.getBookName(),
                request.getIsbn(),
                previousStatus.toString().toLowerCase(),
                newStatus.toString().toLowerCase(),
                statusMessage
        );

        email.setMsgBody(message);
        emailService.sendSimpleMail(email);
    }
}
