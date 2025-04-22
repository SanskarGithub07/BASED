package com.application.based.service;

import com.application.based.entity.BookRequest;
import com.application.based.entity.User;
import com.application.based.model.BookRequestModel;
import com.application.based.model.EmailModel;
import com.application.based.model.RequestStatus;
import com.application.based.repository.BookRepository;
import com.application.based.repository.BookRequestRepository;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Optional;

@Slf4j
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
        log.info("Handling book request for ISBN: {}, User: {}", model.getIsbn(), user.getUsername());

        if (bookRepository.findByIsbn(model.getIsbn()).isPresent()) {
            log.debug("Book already exists in system - ISBN: {}", model.getIsbn());
            return "Book already exists in the system.";
        }

        Optional<BookRequest> existingRequest = bookRequestRepository.findByIsbn(model.getIsbn());
        BookRequest bookRequest;

        if (existingRequest.isPresent()) {
            log.debug("Found existing request for ISBN: {}", model.getIsbn());
            bookRequest = existingRequest.get();

            if (bookRequest.getRequesters().contains(user)) {
                log.debug("User {} already requested this book", user.getUsername());
                return "You've already requested this book.";
            }
        } else {
            log.info("Creating new book request - Title: {}, ISBN: {}", model.getBookName(), model.getIsbn());
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
        log.info("Successfully processed book request - Title: {}, Request ID: {}",
                 bookRequest.getBookName(), bookRequest.getId());

        return "Your book request has been submitted successfully.";
    }

    @Override
    @Transactional
    public String updateRequestStatus(Long requestId, RequestStatus newStatus) {
        log.info("Attempting to update status for request ID: {} to {}", requestId, newStatus);

        BookRequest request = bookRequestRepository.findById(requestId)
                .orElseThrow(() -> {
                    log.error("Request not found with ID: {}", requestId);
                    return new RuntimeException("Request not found");
                });

        if (request.getStatus() != newStatus) {
            log.info("Updating status from {} to {} for request ID: {}",
                     request.getStatus(), newStatus, requestId);

            request.setStatus(newStatus);
            bookRequestRepository.save(request);

            int recipientCount = request.getRequesters().size();
            log.debug("Preparing to send notifications to {} users", recipientCount);

            request.getRequesters().forEach(user ->
                                                    sendStatusUpdateEmail(user, request, newStatus)
            );

            log.info("Successfully updated status and notified {} users", recipientCount);
            return "Status updated. Notifications sent to " + recipientCount + " users.";
        }

        log.debug("No status change required for request ID: {}", requestId);
        return "No status change detected.";
    }

    private void sendStatusUpdateEmail(User user, BookRequest request, RequestStatus newStatus) {
        try {
            log.trace("Preparing status email for user: {}", user.getEmail());

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

            log.debug("Successfully sent status email to {}", user.getEmail());
        } catch (Exception e) {
            log.error("Failed to send status email to {}", user.getEmail(), e);
            throw e;
        }
    }

    @Override
    public Page<BookRequest> getRecentUserRequests(User user, int limit) {
        log.debug("Fetching recent requests for user: {}, limit: {}", user.getUsername(), limit);
        Pageable pageable = PageRequest.of(0, limit, Sort.by("createdAt").descending());
        Page<BookRequest> requests = bookRequestRepository.findRecentRequestsByUser(user.getId(), pageable);
        log.trace("Found {} recent requests for user {}", requests.getNumberOfElements(), user.getUsername());
        return requests;
    }
}