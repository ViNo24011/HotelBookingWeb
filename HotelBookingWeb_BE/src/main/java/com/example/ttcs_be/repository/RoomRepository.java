package com.example.ttcs_be.repository;

import com.example.ttcs_be.model.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface RoomRepository extends JpaRepository<Room, Long> {

    Optional<Room> findByRoomNumber(String roomNumber);

    boolean existsByRoomTypeId(Long roomTypeId);

    @Query("SELECT r FROM Room r " +
            // Thêm điều kiện IS NULL để biến roomTypeId thành tùy chọn
            "WHERE (:roomTypeId IS NULL OR r.roomType.id = :roomTypeId) " +
            "AND r.id NOT IN (" +
            "   SELECT br.room.id FROM BookingRoom br " +
            "   JOIN br.booking b " +
            "   WHERE b.status != 'CANCELLED' " +
            "   AND (b.checkIn < :checkOut) AND (b.checkOut > :checkIn)" +
            ")")
    List<Room> findAvailableRoomsByDatesAndType(
            @Param("checkIn") LocalDate checkIn,
            @Param("checkOut") LocalDate checkOut,
            @Param("roomTypeId") Long roomTypeId
    );
}