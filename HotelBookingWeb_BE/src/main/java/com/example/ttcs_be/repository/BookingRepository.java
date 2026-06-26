package com.example.ttcs_be.repository;

import com.example.ttcs_be.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    // Tìm đơn đặt phòng bằng mã xác nhận
    Optional<Booking> findByConfirmationCode(String confirmationCode);

    // Tìm lịch sử đặt phòng dựa trên ID của User
    List<Booking> findByUserId(Long userId);
    List<Booking> findByUserEmail(String email);
    List<Booking> findByStatusAndCheckOutLessThan(String status, java.time.LocalDate date);

    // Tính tổng doanh thu từ tất cả các đơn đặt phòng (Chỉ tính đơn đã thanh toán hoặc hoàn thành)
    @Query("SELECT SUM(b.totalAmount) FROM Booking b WHERE b.status IN ('CONFIRMED', 'COMPLETED')")
    BigDecimal calculateTotalRevenue();

    // Đếm tổng số lượng đơn đặt phòng (Chỉ tính đơn đã thanh toán hoặc hoàn thành)
    @Query("SELECT COUNT(b) FROM Booking b WHERE b.status IN ('CONFIRMED', 'COMPLETED')")
    long countTotalBookings();

    // Lấy dữ liệu doanh thu theo tháng trong năm hiện tại (Dành cho biểu đồ)
    @Query("SELECT MONTH(b.checkIn) as month, SUM(b.totalAmount) as revenue, COUNT(b) as count " +
           "FROM Booking b " +
           "WHERE YEAR(b.checkIn) = YEAR(CURRENT_DATE) AND b.status IN ('CONFIRMED', 'COMPLETED') " +
           "GROUP BY MONTH(b.checkIn) " +
           "ORDER BY MONTH(b.checkIn) ASC")
    List<Object[]> getMonthlyStatistics();

    // Lấy dữ liệu phân bổ theo loại phòng (Dành cho biểu đồ tròn)
    @Query("SELECT rt.name as type, COUNT(br) as count " +
           "FROM BookingRoom br " +
           "JOIN br.room r " +
           "JOIN r.roomType rt " +
           "JOIN br.booking b " +
           "WHERE b.status IN ('CONFIRMED', 'COMPLETED') " +
           "GROUP BY rt.name")
    List<Object[]> getRoomTypeStatistics();

    @Query("SELECT b FROM Booking b WHERE b.status = :status AND b.checkIn = :checkInDate")
    List<Booking> findByStatusAndCheckIn(@Param("status") String status, @Param("checkInDate") LocalDate checkInDate);
}
