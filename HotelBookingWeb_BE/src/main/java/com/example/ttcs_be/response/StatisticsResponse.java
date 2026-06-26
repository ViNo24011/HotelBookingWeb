package com.example.ttcs_be.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StatisticsResponse {
    private long totalRooms;
    private long totalBookings;
    private BigDecimal totalRevenue;
    private long totalUsers;

    // Chứa dữ liệu cho biểu đồ cột và đường (Tháng, Doanh thu, Số đơn)
    private List<Map<String, Object>> monthlyData;

    // Chứa dữ liệu cho biểu đồ tròn (Loại phòng, Số lượng đặt)
    private List<Map<String, Object>> roomTypeData;
}
