package com.example.ttcs_be.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoomResponse {
    private Long id;
    private String roomNumber;
    private String photo; // Lưu chuỗi Base64 của ảnh
    private BigDecimal price;
    private RoomTypeResponse roomType; // Lồng thông tin Loại phòng
}
