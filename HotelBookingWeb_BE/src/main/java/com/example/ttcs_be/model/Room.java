package com.example.ttcs_be.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.math.BigDecimal;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "room")
public class Room {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Quan hệ Nhiều Phòng thuộc 1 Loại phòng
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_type_id", nullable = false)
    private RoomType roomType;

    @Column(name = "room_number", nullable = false, unique = true, length = 50)
    private String roomNumber;

    @Column(name = "price")
    private BigDecimal roomPrice;

    // Một phòng có thể nằm trong nhiều chi tiết giỏ hàng đặt phòng
    @OneToMany(mappedBy = "room")
    private List<BookingRoom> bookingRooms;
}
