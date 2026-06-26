package com.example.ttcs_be.service;

import com.example.ttcs_be.request.BookingRequest;
import com.example.ttcs_be.model.Booking;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

public interface IBookingService {

    // Nhận vào một Giỏ hàng (BookingRequest) và trả về mã xác nhận (Confirmation Code)
    String saveBooking(BookingRequest bookingRequest);

    @Transactional
    void completeBooking(Long bookingId);

    List<Booking> getAllBookings();

    Booking getBookingByConfirmationCode(String confirmationCode);

    void cancelBooking(Long bookingId);

    List<Booking> getBookingsByUserEmail(String email);
    void deleteBookingByConfirmationCode(String confirmationCode);
    BigDecimal getTotalRevenue();
    long getTotalBookings();
    List<Object[]> getMonthlyStatistics();
    List<Object[]> getRoomTypeStatistics();
}
