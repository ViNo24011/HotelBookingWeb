package com.example.ttcs_be.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.dao.DataIntegrityViolationException;

import java.util.Collections;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // 1. Xử lý lỗi thiếu tham số
    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ResponseEntity<Map<String, String>> handleMissingParams(MissingServletRequestParameterException ex) {
        String name = ex.getParameterName();
        String message = "Thiếu tham số bắt buộc: " + name;
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Collections.singletonMap("message", message));
    }

    // 2. Xử lý lỗi ràng buộc dữ liệu
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, String>> handleDataIntegrity(DataIntegrityViolationException ex) {
        String originalMessage = ex.getMostSpecificCause().getMessage();
        String message = "Vi phạm ràng buộc dữ liệu: " + originalMessage;

        if (originalMessage != null && originalMessage.contains("Duplicate entry")) {
            message = "Dữ liệu bị trùng lặp (có thể là số phòng đã tồn tại). Vui lòng kiểm tra lại!";
        } else if (originalMessage != null && originalMessage.contains("foreign key constraint fails")) {
            message = "Thao tác thất bại do ràng buộc liên kết dữ liệu (có thể loại phòng không tồn tại hoặc đang được sử dụng).";
        }

        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Collections.singletonMap("message", message));
    }

    // 3. Xử lý lỗi không tìm thấy tài nguyên
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleNotFound(ResourceNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Collections.singletonMap("message", ex.getMessage()));
    }

    // 4. Xử lý lỗi tài nguyên đã tồn tại
    @ExceptionHandler(ResourceAlreadyExistsException.class)
    public ResponseEntity<Map<String, String>> handleAlreadyExists(ResourceAlreadyExistsException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Collections.singletonMap("message", ex.getMessage()));
    }

    // 5. Xử lý các lỗi hệ thống khác
    @ExceptionHandler(InternalServerException.class)
    public ResponseEntity<Map<String, String>> handleInternalServer(InternalServerException ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Collections.singletonMap("message", ex.getMessage()));
    }

    @ExceptionHandler(InvalidBookingRequestException.class)
    public ResponseEntity<Map<String, String>> handleInvalidBooking(InvalidBookingRequestException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Collections.singletonMap("message", ex.getMessage()));
    }

    // 6. Xử lý tất cả các ngoại lệ chưa được khai báo
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleGeneralException(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Collections.singletonMap("message", "Lỗi hệ thống không xác định: " + ex.getMessage()));
    }
}
