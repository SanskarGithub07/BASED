package com.application.based.controller;

import com.application.based.entity.Book;
import com.application.based.model.BookModel;
import com.application.based.service.BookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/book")
public class BookController {

    @Autowired
    private BookService bookservice;

    @PostMapping("/add")
    public Book addBook(@RequestBody BookModel bookModel){
        return bookservice.addBook(bookModel);
    }
}
