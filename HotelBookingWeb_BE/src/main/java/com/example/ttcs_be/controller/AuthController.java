package com.example.ttcs_be.controller;

import com.example.ttcs_be.exception.UserAlreadyExistsException;
import com.example.ttcs_be.model.User;
import com.example.ttcs_be.request.LoginRequest;
import com.example.ttcs_be.response.JwtResponse;
import com.example.ttcs_be.security.jwt.JwtUtils;
import com.example.ttcs_be.security.user.HotelUserDetails;
import com.example.ttcs_be.service.IUserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final IUserService userService;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;

    // API 1: Khách hàng gửi thông tin đăng ký
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        try {
            userService.processRegistration(user);
            return ResponseEntity.ok(Collections.singletonMap("message", "Mã xác thực đã được gửi đến email của bạn. Vui lòng kiểm tra!"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // API 2: Khách hàng nhập mã OTP để hoàn tất
    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestParam("email") String email, @RequestParam("otp") String otp) {
        try {
            String result = userService.validateOtpAndSaveUser(email, otp);

            if (result.equals("Xác thực thành công")) {
                return ResponseEntity.ok(Collections.singletonMap("message", "Tài khoản của bạn đã được tạo thành công! Bây giờ bạn có thể đăng nhập."));
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
            }
        } catch (Exception e) {
            System.err.println("OTP Verification Error for " + email + ": " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("message", "Lỗi máy chủ khi xác thực OTP: " + e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest request) {
        // Xác thực người dùng bằng email và mật khẩu
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        // Lưu thông tin người dùng vào Security Context
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Sinh JWT Token
        String jwt = jwtUtils.generateJwtTokenForUser(authentication);

        // Lấy thông tin user và danh sách quyền hạn (Roles)
        HotelUserDetails userDetails = (HotelUserDetails) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities()
                .stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());
        // Trả về DTO JwtResponse chứa đầy đủ thông tin cho Frontend
        return ResponseEntity.ok(new JwtResponse(
                userDetails.getId(),
                userDetails.getEmail(),
                userDetails.getFirstName(),
                userDetails.getLastName(),
                jwt,
                roles));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestParam("email") String email) {
        try {
            userService.requestPasswordReset(email);
            return ResponseEntity.ok(Collections.singletonMap("message", "Mã OTP khôi phục mật khẩu đã được gửi đến email của bạn."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestParam("email") String email, @RequestParam("otp") String otp, @RequestParam("newPassword") String newPassword) {
        try {
            userService.resetPasswordWithOtp(email, otp, newPassword);
            return ResponseEntity.ok(Collections.singletonMap("message", "Mật khẩu đã được đặt lại thành công. Bạn có thể đăng nhập."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}
