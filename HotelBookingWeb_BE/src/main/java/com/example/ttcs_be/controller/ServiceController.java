package com.example.ttcs_be.controller;

import com.example.ttcs_be.model.Service;
import com.example.ttcs_be.response.ServiceResponse;
import com.example.ttcs_be.service.IHotelService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/services")
public class ServiceController {

    private final IHotelService hotelService;

    // 1. Thêm dịch vụ mới (Chỉ Admin)
    @PostMapping("/add")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<ServiceResponse> addService(
            @RequestParam("name") String name,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam("price") BigDecimal price,
            @RequestParam(value = "unit", required = false) String unit) {
        Service savedService = hotelService.addService(name, description, price, unit);
        return ResponseEntity.status(HttpStatus.CREATED).body(mapToResponse(savedService));
    }

    // 2. Lấy tất cả dịch vụ (Dành cho Admin quản lý)
    @GetMapping("/all")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<ServiceResponse>> getAllServices() {
        List<Service> services = hotelService.getAllServices();
        return ResponseEntity.ok(services.stream().map(this::mapToResponse).collect(Collectors.toList()));
    }

    // 3. Lấy CÁC DỊCH VỤ ĐANG HOẠT ĐỘNG (API Mở - Dành cho khách hàng hiển thị trên web)
    @GetMapping("/active")
    public ResponseEntity<List<ServiceResponse>> getActiveServices() {
        List<Service> services = hotelService.getActiveServices();
        return ResponseEntity.ok(services.stream().map(this::mapToResponse).collect(Collectors.toList()));
    }

    // 4. Lấy chi tiết 1 dịch vụ
    @GetMapping("/{id}")
    public ResponseEntity<ServiceResponse> getServiceById(@PathVariable Long id) {
        Service service = hotelService.getServiceById(id);
        return ResponseEntity.ok(mapToResponse(service));
    }

    // 5. Cập nhật dịch vụ (Chỉ Admin)
    @PutMapping("/update/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<ServiceResponse> updateService(
            @PathVariable Long id,
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "price", required = false) BigDecimal price,
            @RequestParam(value = "unit", required = false) String unit,
            @RequestParam(value = "isActive", required = false) Boolean isActive) {
        Service updatedService = hotelService.updateService(id, name, description, price, unit, isActive);
        return ResponseEntity.ok(mapToResponse(updatedService));
    }

    // 6. Xóa (Soft Delete) dịch vụ (Chỉ Admin)
    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Void> deleteService(@PathVariable Long id) {
        hotelService.deleteService(id);
        return ResponseEntity.noContent().build();
    }

    // Hàm Helper chuyển Entity -> DTO
    private ServiceResponse mapToResponse(Service service) {
        return new ServiceResponse(
                service.getId(),
                service.getName(),
                service.getDescription(),
                service.getPrice(),
                service.getUnit(),
                service.isActive()
        );
    }
}