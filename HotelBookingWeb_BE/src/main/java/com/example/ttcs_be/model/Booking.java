package com.example.ttcs_be.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "booking")
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Bắt buộc phải có tài khoản đặt
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    @Column(name = "guest_email")
    private String guestEmail;

    @Column(name = "check_in", nullable = false)
    private LocalDate checkIn;

    @Column(name = "check_out", nullable = false)
    private LocalDate checkOut;

    @Column(name = "guest_name", nullable = false)
    private String guestName;

    @Column(name = "confirmation_code", nullable = false, unique = true)
    private String confirmationCode;

    @Column(name = "total_amount", nullable = false)
    private BigDecimal totalAmount;

    @Column(name = "total_guests", nullable = false)
    private int totalGuests;

    @Column(name = "status")
    private String status = "PENDING";

    @Column(name = "created_at", updatable = false)
    private java.time.LocalDateTime createdAt = java.time.LocalDateTime.now();

    // Quan hệ 1 Đơn hàng có nhiều Chi tiết phòng
    @OneToMany(mappedBy = "booking", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BookingRoom> bookingRooms = new ArrayList<>();

    // Hàm hỗ trợ add chi tiết phòng vào đơn
    public void addBookingRoom(BookingRoom bookingRoom) {
        bookingRooms.add(bookingRoom);
        bookingRoom.setBooking(this);
    }

    @Column(name = "points_earned")
    private Integer pointsEarned = 0;

    @Column(name = "points_used")
    private Integer pointsUsed = 0;

    @Column(name = "discount_amount")
    private BigDecimal discountAmount = BigDecimal.ZERO;

    // Quan hệ 1 Đơn hàng có nhiều Chi tiết dịch vụ
    @OneToMany(mappedBy = "booking", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BookingService> bookingServices = new ArrayList<>();

    // Hàm hỗ trợ add dịch vụ vào đơn
    public void addBookingService(BookingService bookingService) {
        bookingServices.add(bookingService);
        bookingService.setBooking(this);
    }
}
