package com.application.based.controller;

import com.application.based.entity.Book;
import com.application.based.model.BookModel;
import com.application.based.service.BookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/book")
public class BookController {

    @Autowired
    private BookService bookservice;

    @PostMapping("/add")
    public Book addBook(@RequestBody BookModel bookModel){
        return bookservice.addBook(bookModel);
    }

    @GetMapping("/search")
    public List<Book> searchBooks(
            @RequestParam(value = "author", required = false) String authorName,
            @RequestParam(value = "isbn", required = false) Long isbnNumber,
            @RequestParam(value = "name", required = false) String bookName){
        return bookservice.searchBooks(authorName, isbnNumber, bookName);
    }


}
