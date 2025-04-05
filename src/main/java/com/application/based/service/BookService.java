package com.application.based.service;

import com.application.based.entity.Book;
import com.application.based.model.BookModel;

import java.util.List;

public interface BookService {
    Book addBook(BookModel bookModel);
    List<Book> searchBooks(String authorName, Long isbn, String bookName);

}
