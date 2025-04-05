package com.application.based.service;

import com.application.based.entity.Book;
import com.application.based.model.BookModel;
import com.application.based.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class BookServiceImpl implements BookService{
    @Autowired
    private BookRepository bookRepository;

    @Override
    public Book addBook(BookModel bookModel) {
        System.out.println(bookModel.getBookName());
        Book book = Book.builder()
                        .isbn(bookModel.getIsbn())
                                .author(bookModel.getAuthorName())
                                        .bookname(bookModel.getBookName())
                                                .publicationYear(bookModel.getPublicationYear())
                                                        .quantity(bookModel.getQuantity())
                                                                .price(bookModel.getPrice())

                .build();
        return bookRepository.save(book);
    }
}
