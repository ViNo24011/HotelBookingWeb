package com.example.ttcs_be.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "room_type")
public class RoomType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(name = "base_price", nullable = false)
    private BigDecimal basePrice;

    @Column(name = "max_capacity", nullable = false)
    private int maxCapacity;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Lob
    @Column(name = "photo", columnDefinition = "LONGTEXT")
    private String photo;

    // 1 Loại phòng có nhiều Phòng vật lý
    @OneToMany(mappedBy = "roomType", cascade = CascadeType.ALL)
    private List<Room> rooms;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "room_type_service",
            joinColumns = @JoinColumn(name = "room_type_id"),
            inverseJoinColumns = @JoinColumn(name = "service_id")
    )
    private List<Service> freeServices = new ArrayList<>();
}
