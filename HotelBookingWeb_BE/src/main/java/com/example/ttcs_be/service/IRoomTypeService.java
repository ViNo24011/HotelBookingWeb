package com.example.ttcs_be.service;

import com.example.ttcs_be.model.RoomType;
import org.springframework.web.multipart.MultipartFile;
import java.math.BigDecimal;
import java.util.List;

public interface IRoomTypeService {

    RoomType addRoomType(String name, BigDecimal basePrice, int maxCapacity, String description, MultipartFile photo, List<Long> serviceIds);

    List<RoomType> getAllRoomTypes();

    RoomType getRoomTypeById(Long id);

    RoomType updateRoomType(Long id, String name, BigDecimal basePrice, int maxCapacity, String description, MultipartFile photo, List<Long> serviceIds);

    void deleteRoomType(Long id);
}