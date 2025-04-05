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
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "books", referencedColumnName = "ISBN")
    private Long ISBN;

    @NotBlank(message = "Price cannot be blank, please add a price")
    @Column(nullable = false)
    private Integer price;

    @Column()
    private Integer quantity;


}
