package com.example.ttcs_be.repository;

import com.example.ttcs_be.model.Service;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ServiceRepository extends JpaRepository<Service, Long> {
    // Chỉ lấy những dịch vụ đang mở (isActive = true)
    List<Service> findByIsActiveTrue();
}