package com.example.ttcs_be.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReviewRequest {
    private Long bookingId;    // Xác nhận từ đơn hàng nào
    private Long roomTypeId;   // Đánh giá cho loại phòng nào
    private int rating;        // 1-5 sao
    private String comment;    // Nội dung
}