package com.application.based.repository.specification;

import com.application.based.entity.Book;
import com.application.based.model.FilterDto;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

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

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
