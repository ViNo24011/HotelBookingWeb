package com.example.ttcs_be.service;

import com.example.ttcs_be.exception.InternalServerException;
import com.example.ttcs_be.exception.ResourceAlreadyExistsException;
import com.example.ttcs_be.exception.ResourceNotFoundException;
import com.example.ttcs_be.model.RoomType;
import com.example.ttcs_be.repository.RoomTypeRepository;
import com.example.ttcs_be.repository.RoomRepository;
import com.example.ttcs_be.repository.ServiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.Base64;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RoomTypeServiceImpl implements IRoomTypeService {

    private final RoomTypeRepository roomTypeRepository;
    private final RoomRepository roomRepository;
    private final ServiceRepository serviceRepository;


    @Override
    public RoomType addRoomType(String name, BigDecimal basePrice, int maxCapacity, String description, MultipartFile photo, List<Long> serviceIds) {
        if (roomTypeRepository.existsByName(name)) {
            throw new ResourceAlreadyExistsException("Loại phòng mang tên '" + name + "' đã tồn tại!");
        }

        RoomType roomType = new RoomType();
        roomType.setName(name);
        roomType.setBasePrice(basePrice);
        roomType.setMaxCapacity(maxCapacity);
        roomType.setDescription(description);

        if (photo != null && !photo.isEmpty()) {
            try {
                byte[] photoBytes = photo.getBytes();
                String base64Photo = Base64.getEncoder().encodeToString(photoBytes);
                roomType.setPhoto(base64Photo);
            } catch (IOException e) {
                throw new InternalServerException("Lỗi xử lý hình ảnh cho loại phòng: " + e.getMessage());
            }
        }

        if (serviceIds != null && !serviceIds.isEmpty()) {
            List<com.example.ttcs_be.model.Service> freeServices = serviceRepository.findAllById(serviceIds);
            roomType.setFreeServices(freeServices);
        }

        return roomTypeRepository.save(roomType);
    }

    @Override
    public List<RoomType> getAllRoomTypes() {
        return roomTypeRepository.findAll();
    }

    @Override
    public RoomType getRoomTypeById(Long id) {
        return roomTypeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy loại phòng với ID: " + id));
    }

    // 1. Sửa chữ ký hàm
    @Override
    public RoomType updateRoomType(Long id, String name, BigDecimal basePrice, int maxCapacity, String description, MultipartFile photo, List<Long> serviceIds) {
        RoomType existingRoomType = getRoomTypeById(id);

        if (name != null) existingRoomType.setName(name);
        if (basePrice != null) existingRoomType.setBasePrice(basePrice);
        if (maxCapacity > 0) existingRoomType.setMaxCapacity(maxCapacity);
        if (description != null) existingRoomType.setDescription(description);

        if (photo != null && !photo.isEmpty()) {
            try {
                byte[] photoBytes = photo.getBytes();
                String base64Photo = Base64.getEncoder().encodeToString(photoBytes);
                existingRoomType.setPhoto(base64Photo);
            } catch (IOException e) {
                throw new InternalServerException("Lỗi khi cập nhật hình ảnh loại phòng: " + e.getMessage());
            }
        }

        if (serviceIds != null) {
            List<com.example.ttcs_be.model.Service> freeServices = serviceRepository.findAllById(serviceIds);
            existingRoomType.setFreeServices(freeServices);
        }

        return roomTypeRepository.save(existingRoomType);
    }

    @Override
    public void deleteRoomType(Long id) {
        // 1. Kiểm tra xem có tồn tại không
        RoomType roomType = getRoomTypeById(id);

        // 2. Kiểm tra xem có phòng nào đang sử dụng loại này không
        if (roomRepository.existsByRoomTypeId(id)) {
            throw new InternalServerException("Không thể xóa loại phòng '" + roomType.getName() + 
                "' vì hiện đang có các phòng thuộc loại này. Vui lòng xóa các phòng đó trước!");
        }

        roomTypeRepository.delete(roomType);
    }
}
