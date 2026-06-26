package com.example.ttcs_be.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingResponse {
    private Long id;
    private Long userId;
    private LocalDate checkIn;
    private LocalDate checkOut;
    private String guestName;
    private String guestEmail;
    private String confirmationCode;
    private BigDecimal totalAmount;
    private int totalGuests;

    // Danh sách các phòng khách đã đặt trong đơn này
    private List<BookingRoomResponse> bookedRooms;

    private List<BookingServiceResponse> usedServices;
    
    private String status;
    private Long roomTypeId;
}
