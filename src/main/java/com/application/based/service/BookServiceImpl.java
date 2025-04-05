package com.application.based.service;

import com.application.based.entity.Book;
import com.application.based.model.BookModel;
import com.application.based.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookServiceImpl implements BookService{
    @Autowired
    private BookRepository bookRepository;

    @Override
    public Book addBook(BookModel bookModel) {
        System.out.println(bookModel.getAuthorName());
        Book book = Book.builder()
                        .isbn(bookModel.getIsbn())
                                .authorName(bookModel.getAuthorName())
                                        .bookName(bookModel.getBookName())
                                                .publicationYear(bookModel.getPublicationYear())
                                                        .quantity(bookModel.getQuantity())
                                                                .price(bookModel.getPrice())

                .build();
        return bookRepository.save(book);
    }

    @Override
    public List<Book> searchBooks(String authorName, Long isbnNumber, String bookName){
        if(isbnNumber != null){
            Book book = bookRepository.findByIsbn(isbnNumber);
            if(book != null){
                return List.of(book);
            }
            else{
                return List.of();
            }
        }

        if(authorName != null && bookName != null){
            return bookRepository.findByAuthorNameContainingIgnoreCaseAndBookNameContainingIgnoreCase(authorName, bookName);
        }
        else if(authorName != null){
            return bookRepository.findByAuthorNameContainingIgnoreCase(authorName);
        }
        else if(bookName != null){
            return bookRepository.findByBookNameContainingIgnoreCase(bookName);
        }
        else{
            return List.of();
        }
    }
}
