package com.application.based.initialize;

import com.application.based.entity.Book;
import com.application.based.repository.BookRepository;
import com.opencsv.CSVParser;
import com.opencsv.CSVParserBuilder;
import com.opencsv.CSVReader;
import com.opencsv.CSVReaderBuilder;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.io.InputStreamReader;
import java.time.LocalDate;
import java.util.concurrent.ThreadLocalRandom;

@Component
public class BookInitializer implements CommandLineRunner {

    private final BookRepository bookRepository;

    public BookInitializer(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        CSVParser parser = new CSVParserBuilder()
                .withSeparator(';')
                .withQuoteChar('"')
                .build();
        try (
                InputStreamReader inputStreamReader = new InputStreamReader(getClass().getResourceAsStream("/books.csv"));
                CSVReader csvReader = new CSVReaderBuilder(inputStreamReader)
                        .withCSVParser(parser)
                        .build();

        ) {
            String[] line;
            boolean isFirstLine = true;
            int count = 0;
            int maxBooks = 100;

            while ((line = csvReader.readNext()) != null && count < maxBooks) {
                if (isFirstLine) {
                    isFirstLine = false;
                    continue;
                }

                if (line.length < 8) continue;

                try {
                    String isbn = line[0].trim();
                    String title = line[1].trim();
                    String author = line[2].trim();
                    String yearStr = line[3].trim();
                    String publisher = line[4].trim();
                    String imageUrlL = line[7].trim();
                    LocalDate publicationYear = null;

                    try {
                        int year = Integer.parseInt(yearStr);
                        publicationYear = LocalDate.of(year, 1, 1);
                    } catch (Exception ignored) {}

                    if (bookRepository.findByIsbn(isbn).isEmpty()) {
                        double randomPrice = ThreadLocalRandom.current().nextDouble(100.0, 5001.0);
                        long randomQuantity = ThreadLocalRandom.current().nextLong(0, 51);

                        Book book = Book.builder()
                                .isbn(isbn)
                                .bookName(title)
                                .authorName(author)
                                .publisher(publisher)
                                .imageUrl(imageUrlL)
                                .publicationYear(publicationYear)
                                .price(randomPrice)
                                .quantity(randomQuantity)
                                .availability(randomQuantity > 0 ? "IN_STOCK" : "OUT_OF_STOCK")
                                .build();

                        bookRepository.save(book);
                    }

                    count++;
                } catch (Exception e) {
                    System.out.println("Error parsing line: " + String.join(";", line));
                }
            }
        }
    }
}
