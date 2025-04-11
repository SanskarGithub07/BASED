package com.application.based.service;

import com.application.based.entity.Book;
import com.application.based.model.BookInDto;
import com.application.based.model.BookModel;
import com.application.based.model.BookOutDto;
import org.springframework.data.domain.Page;

import java.util.List;

public interface BookService {
    Book addBook(BookModel bookModel);
    List<Book> searchBooks(String authorName, String isbn, String bookName);
    List<Book> searchBooksByPriceRange(double minPrice, double maxPrice);
    List<Book> searchBooksByAvailability(String availability);
    Page<BookOutDto> findBooksWithFilteringPaginationAndSorting(BookInDto build);
}
