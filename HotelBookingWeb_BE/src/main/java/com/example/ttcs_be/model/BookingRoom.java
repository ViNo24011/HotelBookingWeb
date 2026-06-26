package com.example.ttcs_be.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.math.BigDecimal;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "booking_room")
public class BookingRoom {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Tham chiếu về Đơn hàng tổng
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    // Tham chiếu đến Phòng cụ thể
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id", nullable = false)
    private Room room;

    @Column(name = "price_at_booking", nullable = false)
    private BigDecimal priceAtBooking;

    @Column(name = "num_adults", nullable = false)
    private int numAdults;

    @Column(name = "num_children", nullable = false)
    private int numChildren;

    public void setBooking(Booking booking) {
         this.booking = booking;
    }
}