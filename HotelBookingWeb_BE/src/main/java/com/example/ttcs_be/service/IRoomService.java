package com.example.ttcs_be.service;

import com.example.ttcs_be.model.Room;
import java.time.LocalDate;
import java.util.List;

public interface IRoomService {

    Room addNewRoom(Long roomTypeId, String roomNumber);

    List<Room> getAllRooms();

    Room getRoomById(Long roomId);

    Room updateRoom(Long roomId, Long roomTypeId, String roomNumber);

    void deleteRoom(Long roomId);

    List<Room> getAvailableRooms(LocalDate checkInDate, LocalDate checkOutDate, Long roomTypeId);

    long countTotalRooms();
}
