package com.example.ttcs_be.request;

import com.example.ttcs_be.model.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class PendingUser {
    private User user;          // Thông tin đăng ký
    private String otp;         // Mã 6 số
    private LocalDateTime expiryTime; // Thời gian hết hạn
}