package com.application.based.service;

import com.application.based.entity.Book;
import com.application.based.model.*;
import com.application.based.repository.BookRepository;
import com.application.based.repository.specification.BookSpecification;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

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
                                                                        .availability(bookModel.getAvailability())
                .build();
        return bookRepository.save(book);
    }

    @Override
    public Book getBookByIsbn(String isbn){
        return bookRepository.findByIsbn(isbn).get();
    }

    @Override
    public List<Book> searchBooks(String authorName, String isbnNumber, String bookName){
        if(isbnNumber != null){
            Optional<Book> book = bookRepository.findByIsbn(isbnNumber);
            if(book.isPresent()){
                return List.of(book.get());
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

    @Override
    public Page<BookOutDto> findBooksWithFilteringPaginationAndSorting(BookInDto bookInDto) {
        FilterDto filterDto = FilterDto.builder()
                .isbnNumber(bookInDto.getIsbnNumber())
                .authorName(bookInDto.getAuthorName())
                .bookName(bookInDto.getBookName())
                .minPrice(bookInDto.getMinPrice())
                .maxPrice(bookInDto.getMaxPrice())
                .availability(bookInDto.getAvailability())
                .publisherName(bookInDto.getPublisherName())
                .publicationYear(bookInDto.getPublicationYear())
                .build();

        List<SortDto>  sortDtos = jsonStringToSortDto(bookInDto.getSort());
        List<Sort.Order> orders = new ArrayList<>();

        if(sortDtos != null){
            for(SortDto sortDto : sortDtos){
                Sort.Direction direction = Objects.equals(sortDto.getDirection(), "desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
                orders.add(new Sort.Order(direction, sortDto.getField()));
            }
        }

        PageRequest pageRequest = PageRequest.of(
                bookInDto.getPage(),
                bookInDto.getSize(),
                Sort.by(orders)
        );

        Specification<Book> specification = BookSpecification.getSpecification(filterDto);
        Page<Book> books = bookRepository.findAll(specification, pageRequest);

        return books.map(book -> BookOutDto.builder()
                .id(book.getId())
                .isbn(book.getIsbn())
                .authorName(book.getAuthorName())
                .bookName(book.getBookName())
                .price(book.getPrice())
                .quantity(book.getQuantity())
                .publicationYear(book.getPublicationYear())
                .availability(book.getAvailability())
                .publisher(book.getPublisher())
                .imageUrl(book.getImageUrl())
                .genre(book.getGenre())
                .build()
        );
    }

    private List<SortDto> jsonStringToSortDto(String jsonString){
        try{
            ObjectMapper obj = new ObjectMapper();
            return obj.readValue(jsonString, new TypeReference<>() {});
        }
        catch(Exception e){
            System.out.println("Exception occurred: " + e);
            return null;
        }
    }
}
