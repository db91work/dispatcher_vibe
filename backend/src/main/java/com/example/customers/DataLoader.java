package com.example.customers;

import com.example.customers.model.Customer;
import com.example.customers.repository.CustomerRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class DataLoader implements CommandLineRunner {

    private final CustomerRepository repository;

    public DataLoader(CustomerRepository repository) {
        this.repository = repository;
    }

    @Override
    public void run(String... args) {
        if (repository.count() == 0) {
            repository.save(new Customer("Иван Петров", LocalDateTime.of(2026, 3, 15, 10, 30), 15200.50));
            repository.save(new Customer("Мария Сидорова", LocalDateTime.of(2026, 3, 10, 14, 0), 8900.00));
            repository.save(new Customer("Алексей Козлов", LocalDateTime.of(2026, 2, 28, 9, 15), 32100.75));
            repository.save(new Customer("Елена Новикова", LocalDateTime.of(2026, 3, 17, 18, 45), 5400.20));
            repository.save(new Customer("Дмитрий Волков", LocalDateTime.of(2026, 1, 20, 12, 0), 21750.00));
        }
    }
}
