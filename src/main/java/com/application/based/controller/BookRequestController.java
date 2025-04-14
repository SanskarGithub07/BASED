package com.application.based.controller;

import com.application.based.model.BookRequestModel;
import com.application.based.service.BookRequestService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/book")
public class BookRequestController {

    @Autowired
    private BookRequestService bookRequestService;

    @PostMapping("/request")
    public ResponseEntity<String> requestBook(@Valid @RequestBody BookRequestModel model) {
        String response = bookRequestService.handleBookRequest(model);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
}
