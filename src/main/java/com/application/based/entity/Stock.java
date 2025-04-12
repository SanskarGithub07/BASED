package com.application.based.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@Entity
@Table(name="stock")
public class Stock {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "stock_sequence")
    @SequenceGenerator(name = "stock_sequence", sequenceName = "stock_sequence", allocationSize = 1)
    private Long id;

//    @OneToOne
//    @JoinColumn(name = "isbn", referencedColumnName = "isbn")
//    private Book book;  // Reference to Book entity

    @NotBlank(message = "Price cannot be null, please add a price")
    @Column(nullable = false)
    private Integer price;

    @Column()
    private Integer quantity;

}
