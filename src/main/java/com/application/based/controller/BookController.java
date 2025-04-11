package com.application.based.controller;

import com.application.based.entity.Book;
import com.application.based.model.BookInDto;
import com.application.based.model.BookModel;
import com.application.based.model.BookOutDto;
import com.application.based.service.BookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
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

    @GetMapping("/search/params")
    public List<Book> searchBooksByParams(
            @RequestParam(value = "author", required = false) String authorName,
            @RequestParam(value = "isbn", required = false) String isbnNumber,
            @RequestParam(value = "name", required = false) String bookName){
        return bookservice.searchBooks(authorName, isbnNumber, bookName);
    }

    @GetMapping("/search/range")
    public List<Book> searchBooksByRange(
            @RequestParam(value = "minPrice", required = false) double minPrice,
            @RequestParam(value = "maxPrice", required = false) double maxPrice
    ){
        return bookservice.searchBooksByPriceRange(minPrice, maxPrice);
    }

    @GetMapping("/search/available")
    public List<Book> searchBooksByAvailability(
            @RequestParam(value = "availability", required = true) String availability
    ){
        return bookservice.searchBooksByAvailability(availability);
    }

    @GetMapping("/filtering&pagination&sorting")
    public ResponseEntity<Page<BookOutDto>> findBooksWithFilteringPaginationAndSorting(
            @RequestParam(name = "page", defaultValue = "0") Integer page,
            @RequestParam(name = "size", defaultValue = "5") Integer size,
            @RequestParam(name = "sort", defaultValue = "[{\"field\":\"price\",\"direction\":\"desc\"}]") String sort,
            @RequestParam(name = "author", required = false) String authorName,
            @RequestParam(name = "isbn", required = false) String isbnNumber,
            @RequestParam(name = "name", required = false) String bookName
    ){
        System.out.println(authorName);
        Page<BookOutDto> bookDto = bookservice.findBooksWithFilteringPaginationAndSorting(
                BookInDto.builder()
                        .authorName(authorName)
                        .isbnNumber(isbnNumber)
                        .bookName(bookName)
                        .page(page)
                        .size(size)
                        .sort(sort)
                        .build());

        return ResponseEntity.ok(bookDto);
    }

}
