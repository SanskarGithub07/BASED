package com.application.based.service;

import com.application.based.entity.Book;
import com.application.based.model.*;
import com.application.based.repository.BookRepository;
import com.application.based.repository.specification.BookSpecification;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
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

@Slf4j
@Service
public class BookServiceImpl implements BookService {

    @Autowired
    private BookRepository bookRepository;

    @Override
    public Book addBook(BookModel bookModel) {
        log.info("Adding book: {} by {}", bookModel.getBookName(), bookModel.getAuthorName());
        Book book = Book.builder()
                .isbn(bookModel.getIsbn())
                .authorName(bookModel.getAuthorName())
                .bookName(bookModel.getBookName())
                .publicationYear(bookModel.getPublicationYear())
                .quantity(bookModel.getQuantity())
                .price(bookModel.getPrice())
                .availability(bookModel.getAvailability())
                .build();
        Book savedBook = bookRepository.save(book);
        log.debug("Book saved with ID: {}", savedBook.getId());
        return savedBook;
    }

    @Override
    public Book getBookByIsbn(String isbn) {
        log.debug("Fetching book by ISBN: {}", isbn);
        return bookRepository.findByIsbn(isbn).get();
    }

    @Override
    public List<Book> searchBooks(String authorName, String isbnNumber, String bookName) {
        log.debug("Searching books - Author: {}, ISBN: {}, Title: {}", authorName, isbnNumber, bookName);

        if (isbnNumber != null) {
            Optional<Book> book = bookRepository.findByIsbn(isbnNumber);
            log.trace("ISBN search result: {}", book.isPresent() ? "Found" : "Not found");
            return book.map(List::of).orElseGet(List::of);
        }

        if (authorName != null && bookName != null) {
            log.trace("Searching by author and title");
            return bookRepository.findByAuthorNameContainingIgnoreCaseAndBookNameContainingIgnoreCase(authorName, bookName);
        }
        else if (authorName != null) {
            log.trace("Searching by author only");
            return bookRepository.findByAuthorNameContainingIgnoreCase(authorName);
        }
        else if (bookName != null) {
            log.trace("Searching by title only");
            return bookRepository.findByBookNameContainingIgnoreCase(bookName);
        }

        log.warn("Empty search parameters");
        return List.of();
    }

    @Override
    public Page<BookOutDto> findBooksWithFilteringPaginationAndSorting(BookInDto bookInDto) {
        log.info("Executing paginated search - Page: {}, Size: {}", bookInDto.getPage(), bookInDto.getSize());

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
        log.debug("Filter criteria: {}", filterDto);

        List<SortDto> sortDtos = jsonStringToSortDto(bookInDto.getSort());
        List<Sort.Order> orders = new ArrayList<>();

        if(sortDtos != null){
            for(SortDto sortDto : sortDtos){
                Sort.Direction direction = Objects.equals(sortDto.getDirection(), "desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
                orders.add(new Sort.Order(direction, sortDto.getField()));
            };
            log.trace("Sort orders: {}", orders);
        }

        PageRequest pageRequest = PageRequest.of(
                bookInDto.getPage(),
                bookInDto.getSize(),
                Sort.by(orders)
        );

        Specification<Book> specification = BookSpecification.getSpecification(filterDto);
        Page<Book> books = bookRepository.findAll(specification, pageRequest);

        log.debug("Found {} matching books", books.getTotalElements());
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
                .build());
    }

    private List<SortDto> jsonStringToSortDto(String jsonString){
        try{
            ObjectMapper obj = new ObjectMapper();
            return obj.readValue(jsonString, new TypeReference<>() {});
        }
        catch(Exception e){
            log.warn("Invalid sort JSON: {}", jsonString);
            return null;
        }
    }
}