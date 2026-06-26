package com.example.ttcs_be.service;

import com.example.ttcs_be.exception.UserAlreadyExistsException;
import com.example.ttcs_be.model.Role;
import com.example.ttcs_be.model.User;
import com.example.ttcs_be.repository.RoleRepository;
import com.example.ttcs_be.repository.UserRepository;
import com.example.ttcs_be.request.PendingUser;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
public class UserService implements IUserService {
    private static final Logger logger = LoggerFactory.getLogger(UserService.class);
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final RoleRepository roleRepository;

    private final EmailService emailService; // Nhúng EmailService vào đây
    private final Map<String, PendingUser> pendingUserMap = new ConcurrentHashMap<>();

    private static class ResetToken {
        String otp;
        LocalDateTime expiryTime;
        ResetToken(String otp, LocalDateTime expiryTime) { this.otp = otp; this.expiryTime = expiryTime; }
    }
    private final Map<String, ResetToken> passwordResetMap = new ConcurrentHashMap<>();

    @Override
    public User registerUser(User user) {
        // Kiểm tra xem user đã tồn tại trong database chưa
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new UserAlreadyExistsException(user.getEmail() + " already exists");
        }

        // Mã hóa mật khẩu
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // Gán quyền mặc định là ROLE_USER cho mọi tài khoản mới tạo
        Role userRole = roleRepository.findByName("ROLE_USER").get();
        user.setRoles(Collections.singletonList(userRole));

        return userRepository.save(user);
    }

    @Override
    public List<User> getUsers() {
        return userRepository.findAll();
    }

    @Transactional
    @Override
    public void deleteUser(String email) {
        User theUser = getUser(email);
        if (theUser != null) {
            userRepository.deleteByEmail(email);
        }
    }

    @Override
    public User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }
    @Override
    public User updateUserRole(String email, String roleName) {
        // Tìm User theo email
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Không tìm thấy User với email: " + email));

        // Tìm Role theo tên (Ví dụ: "ROLE_ADMIN")
        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new RuntimeException("Quyền hạn không tồn tại: " + roleName));

        // Nạp thêm quyền mới cho User (Tránh trùng lặp nếu đã có quyền)
        if (!user.getRoles().contains(role)) {
            user.getRoles().add(role);
        }

        return userRepository.save(user);
    }
    @Override
    public void processRegistration(User user) {
        // 1. Kiểm tra xem email đã tồn tại trong Database thật chưa
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email " + user.getEmail() + " đã được sử dụng!");
        }

        // 2. Mã hóa mật khẩu và gán quyền (Nhưng CHƯA LƯU vào DB)
        user.setPassword(passwordEncoder.encode(user.getPassword()));


        // 3. Tạo mã OTP ngẫu nhiên (6 số)

        String otp = org.apache.commons.lang3.RandomStringUtils.randomNumeric(6);

        // 4. Tính thời gian hết hạn (5 phút sau)
        LocalDateTime expiryTime = LocalDateTime.now().plusMinutes(5);

        // 5. Cất toàn bộ vào "Kho tạm" trên RAM
        pendingUserMap.put(user.getEmail(), new PendingUser(user, otp, expiryTime));

        // 6. Gửi Email cho khách
        emailService.sendOtpEmail(user.getEmail(), otp);

        System.out.println("OTP cho " + user.getEmail() + " là: " + otp);
    }

    @Override
    public String validateOtpAndSaveUser(String email, String otp) {
        // Lấy thông tin từ kho tạm ra
        PendingUser pending = pendingUserMap.get(email);

        // Trường hợp 1: Không tìm thấy (Do nhập sai email hoặc chưa đăng ký)
        if (pending == null) {
            return "Không tìm thấy yêu cầu đăng ký cho email này!";
        }

        // Trường hợp 2: Hết hạn 5 phút
        if (LocalDateTime.now().isAfter(pending.getExpiryTime())) {
            pendingUserMap.remove(email); // Xóa dữ liệu rác
            return "Mã OTP đã hết hạn sau 5 phút. Vui lòng đăng ký lại!";
        }

        // Trường hợp 3: Nhập sai mã
        if (!pending.getOtp().equals(otp)) {
            return "Mã OTP không chính xác!";
        }


        // Lấy user từ bộ nhớ tạm ra
        User userToSave = pending.getUser();

        //Lấy quyền và gán ngay trước khi lưu
        Role userRole = roleRepository.findByName("ROLE_USER")
                .orElseThrow(() -> new RuntimeException("Lỗi: Không tìm thấy quyền ROLE_USER"));
        
        userToSave.getRoles().clear();
        userToSave.getRoles().add(userRole);

        try {
            // Lưu vào Database
            userRepository.save(userToSave);
            pendingUserMap.remove(email);
            return "Xác thực thành công";
        } catch (Exception e) {
            logger.error("Lỗi nghiêm trọng khi lưu User sau khi xác thực OTP cho {}: {}", email, e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Lỗi hệ thống khi hoàn tất đăng ký: " + e.getMessage());
        }
    }

    @Override
    public void changePassword(Long userId, String oldPassword, String newPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("Không tìm thấy người dùng!"));

        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new RuntimeException("Mật khẩu cũ không chính xác!");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    @Override
    public long countTotalUsers() {
        return userRepository.count();
    }

    public void requestPasswordReset(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Không tìm thấy người dùng với email: " + email));
        
        String otp = org.apache.commons.lang3.RandomStringUtils.randomNumeric(6);
        passwordResetMap.put(email, new ResetToken(otp, LocalDateTime.now().plusMinutes(5)));
        emailService.sendPasswordResetOtpEmail(email, otp);
    }

    public void resetPasswordWithOtp(String email, String otp, String newPassword) {
        ResetToken token = passwordResetMap.get(email);
        if (token == null) throw new RuntimeException("Không có yêu cầu khôi phục mật khẩu cho email này!");
        if (LocalDateTime.now().isAfter(token.expiryTime)) {
            passwordResetMap.remove(email);
            throw new RuntimeException("Mã OTP đã hết hạn!");
        }
        if (!token.otp.equals(otp)) throw new RuntimeException("Mã OTP không chính xác!");

        User user = userRepository.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("Không tìm thấy email"));
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        passwordResetMap.remove(email);
    }
}
