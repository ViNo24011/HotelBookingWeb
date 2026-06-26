package com.example.ttcs_be.controller;

import com.example.ttcs_be.model.Booking;
import com.example.ttcs_be.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    @Value("${sepay.api.key}")
    private String sepayApiKey; // Lấy API Key từ cấu hình

    @Autowired
    private BookingRepository bookingRepository;

    @PostMapping("/webhook")
    public ResponseEntity<?> handleSePayWebhook(
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestBody Map<String, Object> payload) { // Nhận payload từ SePay

        // 1. Xác thực API Key để chống giả mạo
        if (authorizationHeader == null || !authorizationHeader.equals("Apikey " + sepayApiKey)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Sai API Key");
        }

        try {
            // 2. Bóc tách dữ liệu từ SePay
            String transferType = (String) payload.get("transferType"); // "in" hoặc "out"
            String content = (String) payload.get("content");           // Nội dung (chứa bookingId)
            
            // Lấy số tiền chuyển khoản và ép kiểu an toàn về BigDecimal
            Object transferAmountObj = payload.get("transferAmount");
            BigDecimal transferAmount = BigDecimal.ZERO;
            if (transferAmountObj instanceof Number) {
                transferAmount = new BigDecimal(((Number) transferAmountObj).toString());
            } else if (transferAmountObj instanceof String) {
                transferAmount = new BigDecimal((String) transferAmountObj);
            }

            // 3. Kiểm tra điều kiện hợp lệ [5, 17]
            if ("in".equals(transferType) && content != null) {
                // Dùng Regex để tìm mã xác nhận gồm đúng 10 chữ số trong nội dung chuyển khoản
                // (Vì confirmationCode trong BookingServiceImpl đang được gen bằng RandomStringUtils.randomNumeric(10))
                Pattern pattern = Pattern.compile("\\b\\d{10}\\b");
                Matcher matcher = pattern.matcher(content);
                String bookingCode = null;
                
                if (matcher.find()) {
                    bookingCode = matcher.group();
                }
                
                if (bookingCode == null) {
                    return ResponseEntity.ok("Không tìm thấy mã đặt phòng hợp lệ trong nội dung chuyển khoản");
                }

                // Tìm Booking trong DB
                Booking booking = bookingRepository.findByConfirmationCode(bookingCode).orElse(null);

                if (booking != null && "PENDING".equals(booking.getStatus())) {
                    // 4. KIỂM TRA SỐ TIỀN CÓ KHỚP VỚI TỔNG TIỀN PHÒNG KHÔNG
                    if (transferAmount.compareTo(booking.getTotalAmount()) < 0) {
                        return ResponseEntity.ok("Khách hàng chuyển thiếu tiền. Yêu cầu kiểm tra lại!");
                    }
                    
                    // Cập nhật trạng thái thành CONFIRMED (Đã thanh toán), để dành COMPLETED cho lúc khách Check-out
                    booking.setStatus("CONFIRMED");
                    bookingRepository.save(booking);
                    return ResponseEntity.ok("Xử lý thành công");
                }
            }
            return ResponseEntity.ok("Bỏ qua giao dịch không hợp lệ");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi server");
        }
    }
}