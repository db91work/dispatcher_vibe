package com.example.customers.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "customers")
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(name = "last_visit")
    private LocalDateTime lastVisit;

    @Column(name = "total_purchased")
    private Double totalPurchased;

    public Customer() {}

    public Customer(String name, LocalDateTime lastVisit, Double totalPurchased) {
        this.name = name;
        this.lastVisit = lastVisit;
        this.totalPurchased = totalPurchased;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public LocalDateTime getLastVisit() { return lastVisit; }
    public void setLastVisit(LocalDateTime lastVisit) { this.lastVisit = lastVisit; }

    public Double getTotalPurchased() { return totalPurchased; }
    public void setTotalPurchased(Double totalPurchased) { this.totalPurchased = totalPurchased; }
}
