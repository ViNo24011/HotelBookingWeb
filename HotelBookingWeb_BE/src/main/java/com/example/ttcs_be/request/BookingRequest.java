package com.example.ttcs_be.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingRequest {
    private Long userId; // Định danh tài khoản người đặt
    private LocalDate checkIn;
    private LocalDate checkOut;
    private String guestName;
    private boolean usePoints;

    //  Danh sách các phòng khách muốn đặt cùng lúc
    private List<BookingRoomRequest> selectedRooms;
    // Dịch vụ
    private List<BookingServiceRequest> selectedServices = new ArrayList<>();
}
