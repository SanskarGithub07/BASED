package com.application.based.controller;

import com.application.based.entity.User;
import com.application.based.model.BookRequestModel;
import com.application.based.model.RequestStatus;
import com.application.based.service.BookRequestService;
import com.application.based.util.AuthenticatedUserUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/request")
public class BookRequestController {

    @Autowired
    private BookRequestService bookRequestService;

    @Autowired
    private AuthenticatedUserUtil authenticatedUserUtil;

    @PostMapping("/book")
    public ResponseEntity<String> requestBook(@Valid @RequestBody BookRequestModel model, HttpServletRequest request) {
        User user = authenticatedUserUtil.getCurrentAuthenticatedUser(request);
        String response = bookRequestService.handleBookRequest(model, user);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

//    @PatchMapping("/{requestId}/status")
//    public ResponseEntity<String> updateRequestStatus(
//            @PathVariable Long requestId,
//            @RequestParam RequestStatus status,
//            HttpServletRequest request) {
//
//        // TODO Add admin/owner check here
//        String response = bookRequestService.updateRequestStatus(requestId, status);
//        return ResponseEntity.ok(response);
//    }

    @PatchMapping("/{requestId}/status")
    public ResponseEntity<String> updateRequestStatus(
            @PathVariable Long requestId,
            @RequestParam RequestStatus status) {

        String result = bookRequestService.updateRequestStatus(requestId, status);
        return ResponseEntity.ok(result);
    }

//    @GetMapping("/user")
//    public ResponseEntity<List<BookRequest>> getUserRequests(
//            HttpServletRequest request,
//            @RequestParam(defaultValue = "5") int limit) {
//
//        User user = authenticatedUserUtil.getCurrentAuthenticatedUser(request);
//        List<BookRequest> requests = bookRequestService.getUserRequests(user, limit);
//        return ResponseEntity.ok(requests);
//    }

//    @GetMapping("/user")
//    public ResponseEntity<Page<BookRequest>> getUserRequests(
//            HttpServletRequest request,
//            @RequestParam(defaultValue = "0") int page,
//            @RequestParam(defaultValue = "3") int size) {
//
//        User user = authenticatedUserUtil.getCurrentAuthenticatedUser(request);
//        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
//        return ResponseEntity.ok(bookRequestService.getUserRequests(user, pageable));
//    }
}
