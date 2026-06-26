package com.example.ttcs_be.service;

import com.example.ttcs_be.model.Service;
import java.math.BigDecimal;
import java.util.List;

public interface IHotelService {
    Service addService(String name, String description, BigDecimal price, String unit);
    List<Service> getAllServices();
    List<Service> getActiveServices(); // Chỉ lấy dịch vụ đang hiển thị
    Service getServiceById(Long id);
    Service updateService(Long id, String name, String description, BigDecimal price, String unit, Boolean isActive);
    void deleteService(Long id);
}