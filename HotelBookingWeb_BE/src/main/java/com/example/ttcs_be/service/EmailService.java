package com.example.ttcs_be.service;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Async // Chạy ngầm để Frontend không phải chờ gửi mail xong mới nhận được phản hồi
    public void sendOtpEmail(String to, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Mã xác thực đăng ký tài khoản khách sạn");
        message.setText("Chào bạn,\n\nMã xác thực (OTP) của bạn là: " + otp + "\n\nMã này sẽ hết hạn trong 5 phút. Vui lòng không chia sẻ mã này cho ai.");
        mailSender.send(message);
    }

    @Async
    public void sendPasswordResetOtpEmail(String to, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Mã xác thực khôi phục mật khẩu");
        message.setText("Chào bạn,\n\nMã xác thực (OTP) để khôi phục mật khẩu của bạn là: " + otp + "\n\nMã này sẽ hết hạn trong 5 phút.");
        mailSender.send(message);
    }

    @Async
    public void sendCheckInReminderEmail(String to, String guestName, String confirmationCode, java.time.LocalDate checkIn) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Nhắc nhở: Lịch nhận phòng ngày mai!");
        message.setText("Chào " + guestName + ",\n\nĐây là email nhắc nhở bạn có lịch nhận phòng tại khách sạn chúng tôi vào ngày mai (" + checkIn + ").\n\nMã xác nhận đặt phòng của bạn là: " + confirmationCode + "\n\nRất mong được đón tiếp bạn!");
        mailSender.send(message);
    }
}