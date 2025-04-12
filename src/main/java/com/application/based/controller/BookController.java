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

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
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
            @RequestParam(value = "name", required = false) String bookName) {
        return bookservice.searchBooks(authorName, isbnNumber, bookName);
    }

    @GetMapping("/filtering&pagination&sorting")
    public ResponseEntity<Page<BookOutDto>> findBooksWithFilteringPaginationAndSorting(
            @RequestParam(name = "page", defaultValue = "0") Integer page,
            @RequestParam(name = "size", defaultValue = "5") Integer size,
            @RequestParam(name = "sort", defaultValue = "[{\"field\":\"price\",\"direction\":\"desc\"}]") String sort,
            @RequestParam(name = "author-name", required = false) String authorName,
            @RequestParam(name = "isbn-number", required = false) String isbnNumber,
            @RequestParam(name = "book-name", required = false) String bookName,
            @RequestParam(name = "min-price", required = false) Double minPrice,
            @RequestParam(name = "max-price", required = false) Double maxPrice,
            @RequestParam(name = "availability", required = false) String availability,
            @RequestParam(name = "publisher", required = false) String publisherName,
            @RequestParam(name = "publication-year", required = false) Integer publicationYear
    ){
        String decodedSort = URLDecoder.decode(sort, StandardCharsets.UTF_8);
        Page<BookOutDto> bookDto = bookservice.findBooksWithFilteringPaginationAndSorting(
                BookInDto.builder()
                        .authorName(authorName)
                        .isbnNumber(isbnNumber)
                        .bookName(bookName)
                        .minPrice(minPrice)
                        .maxPrice(maxPrice)
                        .availability(availability)
                        .publisherName(publisherName)
                        .publicationYear(publicationYear)
                        .page(page)
                        .size(size)
                        .sort(decodedSort)
                        .build());

        return ResponseEntity.ok(bookDto);
    }

}
