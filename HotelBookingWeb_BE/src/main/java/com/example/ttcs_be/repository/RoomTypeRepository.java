package com.example.ttcs_be.repository;

import com.example.ttcs_be.model.RoomType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoomTypeRepository extends JpaRepository<RoomType, Long> {
    boolean existsByName(String name);
}
