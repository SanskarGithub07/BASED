package com.application.based.repository.specification;

import com.application.based.entity.Book;
import com.application.based.model.FilterDto;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class BookSpecification {
    public static Specification<Book> getSpecification(FilterDto filterDto){
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();
            if(filterDto.getBookName() != null){
                predicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("bookName")), "%" + filterDto.getBookName().toLowerCase() + "%"));
            }

            if(filterDto.getAuthorName() != null){
                predicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("authorName")), "%" + filterDto.getAuthorName().toLowerCase() + "%"));
            }

            if(filterDto.getIsbnNumber() != null){
                predicates.add(criteriaBuilder.equal(root.get("isbn"), filterDto.getIsbnNumber()));
            }

            if(filterDto.getAvailability() != null){
                predicates.add(criteriaBuilder.equal(root.get("availability"), filterDto.getAvailability()));
            }

            if(filterDto.getPublisherName() != null){
                predicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("publisher")), "%" + filterDto.getPublisherName().toLowerCase() + "%"));
            }

            if (filterDto.getPublicationYear() != null) {
                LocalDate startOfYear = LocalDate.of(filterDto.getPublicationYear(), 1, 1);
                LocalDate endOfYear = startOfYear.withMonth(12).withDayOfMonth(31);

                predicates.add(criteriaBuilder.between(root.get("publicationYear"), startOfYear, endOfYear));
            }


            if(filterDto.getMinPrice() != null && filterDto.getMaxPrice() != null){
                predicates.add(criteriaBuilder.between(root.get("price"), filterDto.getMinPrice(), filterDto.getMaxPrice()));
            }
            else if(filterDto.getMinPrice() != null){
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("price"), filterDto.getMinPrice()));
            }
            else if(filterDto.getMaxPrice() != null){
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("price"), filterDto.getMaxPrice()));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
