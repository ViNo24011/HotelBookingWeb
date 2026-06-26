package com.example.ttcs_be.service;

import com.example.ttcs_be.exception.ResourceNotFoundException;
import com.example.ttcs_be.model.Service;
import com.example.ttcs_be.repository.ServiceRepository;
import lombok.RequiredArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@org.springframework.stereotype.Service
@RequiredArgsConstructor
public class HotelServiceImpl implements IHotelService {

    private final ServiceRepository serviceRepository;

    @Override
    public Service addService(String name, String description, BigDecimal price, String unit) {
        Service service = new Service();
        service.setName(name);
        service.setDescription(description);
        service.setPrice(price);
        service.setUnit(unit);
        service.setActive(true);
        return serviceRepository.save(service);
    }

    @Override
    public List<Service> getAllServices() {
        return serviceRepository.findAll();
    }

    @Override
    public List<Service> getActiveServices() {
        return serviceRepository.findByIsActiveTrue();
    }

    @Override
    public Service getServiceById(Long id) {
        return serviceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy dịch vụ ID: " + id));
    }

    @Override
    public Service updateService(Long id, String name, String description, BigDecimal price, String unit, Boolean isActive) {
        Service existingService = getServiceById(id);

        if (name != null) existingService.setName(name);
        if (description != null) existingService.setDescription(description);
        if (price != null) existingService.setPrice(price);
        if (unit != null) existingService.setUnit(unit);
        if (isActive != null) existingService.setActive(isActive);

        return serviceRepository.save(existingService);
    }

    @Override
    public void deleteService(Long id) {
        Service service = getServiceById(id);
        // Soft delete: Ẩn đi chứ không xóa cứng để tránh lỗi mất lịch sử hóa đơn cũ
        service.setActive(false);
        serviceRepository.save(service);
    }
}