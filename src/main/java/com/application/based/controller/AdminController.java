package com.application.based.controller;

import com.application.based.model.BookOutDto;
import com.application.based.service.BookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private BookService bookService;

    @GetMapping("/low-stock-books")
    public ResponseEntity<List<BookOutDto>> getLowStockBooks(){
        List<BookOutDto> bookOutDtoList = bookService.findAllLowStockBooks();
        return ResponseEntity.ok(bookOutDtoList);
    }
}
