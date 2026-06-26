package com.example.ttcs_be.controller;

import com.example.ttcs_be.response.RoomResponse;
import com.example.ttcs_be.response.RoomTypeResponse;
import com.example.ttcs_be.model.Room;
import com.example.ttcs_be.service.IRoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/rooms")

public class RoomController {

    private final IRoomService roomService;

    // 1. Thêm phòng vật lý mới
    @PostMapping("/add/new-room")
    public ResponseEntity<RoomResponse> addNewRoom(
            @RequestParam("roomTypeId") Long roomTypeId,
            @RequestParam("roomNumber") String roomNumber) {
        Room savedRoom = roomService.addNewRoom(roomTypeId, roomNumber);
        return ResponseEntity.status(HttpStatus.CREATED).body(mapToRoomResponse(savedRoom));
    }

    // 2. Lấy danh sách toàn bộ phòng
    @GetMapping("/all-rooms")
    public ResponseEntity<List<RoomResponse>> getAllRooms() {
        List<Room> rooms = roomService.getAllRooms();
        List<RoomResponse> roomResponses = rooms.stream()
                .map(this::mapToRoomResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(roomResponses);
    }

    // 3. Lấy thông tin phòng theo ID
    @GetMapping("/room/{roomId}")
    public ResponseEntity<RoomResponse> getRoomById(@PathVariable Long roomId) {
        Room room = roomService.getRoomById(roomId);
        return ResponseEntity.ok(mapToRoomResponse(room));
    }

    // 4. Cập nhật thông tin phòng
    @PutMapping("/update/{roomId}")
    public ResponseEntity<RoomResponse> updateRoom(
            @PathVariable Long roomId,
            @RequestParam(value = "roomTypeId", required = false) Long roomTypeId,
            @RequestParam(value = "roomNumber", required = false) String roomNumber) {
        Room updatedRoom = roomService.updateRoom(roomId, roomTypeId, roomNumber);
        return ResponseEntity.ok(mapToRoomResponse(updatedRoom));
    }

    // 5. Xóa phòng
    @DeleteMapping("/delete/room/{roomId}")
    public ResponseEntity<Void> deleteRoom(@PathVariable Long roomId) {
        roomService.deleteRoom(roomId);
        return ResponseEntity.noContent().build();
    }

    // 6. Tìm kiếm phòng trống
    @GetMapping("/available-rooms")
    public ResponseEntity<List<RoomResponse>> getAvailableRooms(
            @RequestParam("checkInDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkInDate,
            @RequestParam("checkOutDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkOutDate,
            @RequestParam(value = "roomTypeId", required = false) Long roomTypeId) {

        List<Room> availableRooms = roomService.getAvailableRooms(checkInDate, checkOutDate, roomTypeId);
        List<RoomResponse> roomResponses = availableRooms.stream()
                .map(this::mapToRoomResponse)
                .collect(Collectors.toList());

        if (roomResponses.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(roomResponses);
    }

    /**
     * Hàm Helper hỗ trợ ánh xạ (map) từ Entity sang DTO

     **/
    private RoomResponse mapToRoomResponse(Room room) {
        // 1. Chuyển đổi danh sách Dịch vụ miễn phí
        List<com.example.ttcs_be.response.ServiceResponse> freeServices = new java.util.ArrayList<>();
        if (room.getRoomType().getFreeServices() != null) {
            freeServices = room.getRoomType().getFreeServices().stream()
                    .map(s -> new com.example.ttcs_be.response.ServiceResponse(
                            s.getId(), s.getName(), s.getDescription(), s.getPrice(), s.getUnit(), s.isActive()))
                    .collect(java.util.stream.Collectors.toList());
        }

        // 2. Map cấu hình loại phòng
        RoomTypeResponse roomTypeResponse = new RoomTypeResponse(
                room.getRoomType().getId(),
                room.getRoomType().getName(),
                room.getRoomType().getBasePrice(),
                room.getRoomType().getMaxCapacity(),
                room.getRoomType().getDescription(),
                room.getRoomType().getPhoto(),
                freeServices
        );

        // 3. Map đối tượng phòng và gắn loại phòng vào
        return new RoomResponse(
                room.getId(),
                room.getRoomNumber(),
                room.getRoomType().getPhoto(),
                room.getRoomType().getBasePrice(),
                roomTypeResponse
        );
    }
}
