package com.example.ttcs_be.service;

import com.example.ttcs_be.exception.InternalServerException;
import com.example.ttcs_be.exception.ResourceAlreadyExistsException;
import com.example.ttcs_be.exception.ResourceNotFoundException;
import com.example.ttcs_be.model.Room;
import com.example.ttcs_be.model.RoomType;
import com.example.ttcs_be.repository.RoomRepository;
import com.example.ttcs_be.repository.RoomTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Base64;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RoomServiceImpl implements IRoomService {

    private final RoomRepository roomRepository;
    private final RoomTypeRepository roomTypeRepository;

    @Override
    public Room addNewRoom(Long roomTypeId, String roomNumber) {
        String trimmedRoomNumber = roomNumber != null ? roomNumber.trim() : null;

        // 1. Kiểm tra xem số phòng (roomNumber) đã tồn tại chưa
        if (roomRepository.findByRoomNumber(trimmedRoomNumber).isPresent()) {
            throw new ResourceAlreadyExistsException("Số phòng " + trimmedRoomNumber + " đã tồn tại trong hệ thống!");
        }

        // 2. Tìm loại phòng (RoomType) để ánh xạ
        RoomType roomType = roomTypeRepository.findById(roomTypeId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy loại phòng với ID: " + roomTypeId));

        Room room = new Room();
        room.setRoomType(roomType);
        room.setRoomNumber(trimmedRoomNumber);
        room.setRoomPrice(roomType.getBasePrice()); // Gán giá trị mặc định từ Loại phòng để khớp DB

        return roomRepository.save(room);
    }

    @Override
    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    @Override
    public Room getRoomById(Long roomId) {
        return roomRepository.findById(roomId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy phòng với ID: " + roomId));
    }

    @Override
    public Room updateRoom(Long roomId, Long roomTypeId, String roomNumber) {
        Room existingRoom = getRoomById(roomId);

        // Cập nhật Loại phòng nếu có thay đổi
        if (roomTypeId != null && !existingRoom.getRoomType().getId().equals(roomTypeId)) {
            RoomType roomType = roomTypeRepository.findById(roomTypeId)
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy loại phòng với ID: " + roomTypeId));
            existingRoom.setRoomType(roomType);
        }

        // Cập nhật Số phòng nếu có thay đổi và không bị trùng
        if (roomNumber != null && !existingRoom.getRoomNumber().equals(roomNumber)) {
            if (roomRepository.findByRoomNumber(roomNumber).isPresent()) {
                throw new ResourceAlreadyExistsException("Số phòng " + roomNumber + " đã được sử dụng!");
            }
            existingRoom.setRoomNumber(roomNumber);
        }

        return roomRepository.save(existingRoom);
    }

    @Override
    public void deleteRoom(Long roomId) {
        Room room = getRoomById(roomId);
        roomRepository.delete(room);
    }

    @Override
    public List<Room> getAvailableRooms(LocalDate checkInDate, LocalDate checkOutDate, Long roomTypeId) {
        // Gọi thẳng xuống câu Query ở RoomRepository
        return roomRepository.findAvailableRoomsByDatesAndType(checkInDate, checkOutDate, roomTypeId);
    }

    @Override
    public long countTotalRooms() {
        return roomRepository.count();
    }
}
