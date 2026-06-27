# 🏨 Hotel Booking Management System (Hệ thống Quản lý Đặt phòng Khách sạn)

Dự án **Hotel Booking Management System** là một ứng dụng Web Full-stack toàn diện được thiết kế để đơn giản hóa quy trình đặt phòng khách sạn trực tuyến và quản lý hoạt động nội bộ dành cho Quản trị viên. 

Dự án này tích hợp cả phần Front-end hiện đại và hệ thống Back-end mạnh mẽ, bảo mật cao, rất phù hợp để làm điểm nhấn trong hồ sơ năng lực (CV) cá nhân.

---

## 🏗️ Cấu trúc Thư mục Dự án

Repository này bao gồm 2 dự án thành phần chính:
```text
HotelBookingWeb/ (Root Repository)
├── -HotelBookingWeb_FE1/       # React (Vite) Frontend App
│   ├── src/                    # Mã nguồn giao diện người dùng
│   ├── public/                 # Tài nguyên tĩnh
│   ├── .env.example            # Tệp ví dụ cấu hình biến môi trường
│   └── package.json            # Các thư viện và script của Node.js
│
└── HotelBookingWeb_BE/         # Java Spring Boot Backend Service
    ├── src/                    # Mã nguồn backend (Controller, Service, Entity...)
    ├── pom.xml                 # Cấu hình Maven dependencies
    └── insert_mock_data.sql    # Cơ sở dữ liệu mẫu ban đầu (Mock Data)
```

---

## 🛠️ Công nghệ Sử dụng (Tech Stack)

### Front-end
- **Framework**: React.js (Vite)
- **Styling**: Bootstrap / Vanilla CSS
- **HTTP Client**: Axios (giao tiếp API động)
- **Routing & State**: React Router DOM

### Back-end
- **Language**: Java 17+
- **Framework**: Spring Boot (Spring Web, Spring Security, Spring Data JPA)
- **Authentication**: JWT (JSON Web Token) cho đăng nhập/phân quyền người dùng và quản trị viên
- **Build Tool**: Maven

### Database & Systems
- **Database**: MySQL (hoặc các RDBMS tương thích)

---

## ✨ Tính năng chính

### 👤 Dành cho Khách hàng (User Workspace)
- **Đăng ký & Xác thực**: Tạo tài khoản mới, xác minh OTP qua Email, đăng nhập an toàn bằng JWT.
- **Tìm kiếm Phòng**: Lọc phòng trống theo ngày nhận phòng (Check-in), ngày trả phòng (Check-out) và loại phòng mong muốn.
- **Quy trình Đặt phòng**: Đặt phòng thuận tiện và nhận mã xác nhận đặt phòng (Booking Confirmation Code).
- **Đánh giá & Review**: Viết đánh giá, bình luận và chấm điểm sau khi hoàn tất kỳ nghỉ, ủng hộ/bỏ phiếu cho các bình luận hữu ích khác.
- **Quản lý cá nhân**: Xem lịch sử đặt phòng, quản lý thông tin tài khoản và đổi mật khẩu bảo mật.

### 👑 Dành cho Quản trị viên (Admin Portal)
- **Bảng điều khiển (Dashboard)**: Thống kê doanh thu, số phòng đang đặt, số phòng trống, số dịch vụ hoạt động dưới dạng biểu đồ/số liệu tổng quan.
- **Quản lý loại phòng (Room Types)**: Thêm, sửa thông tin loại phòng, ảnh đại diện, giá cơ bản, sức chứa tối đa và mô tả.
- **Quản lý phòng (Rooms)**: Phân bổ mã số phòng thực tế theo từng loại phòng cụ thể.
- **Quản lý Đặt phòng (Bookings)**: Theo dõi danh sách phòng được đặt, cập nhật trạng thái hoàn tất hoặc hủy đặt phòng.
- **Quản lý dịch vụ (Services)**: Thêm mới các dịch vụ đi kèm (như Buffet, Gym, Spa...), cập nhật trạng thái hoạt động và giá cả.

---

## 🚀 Hướng dẫn Cài đặt & Chạy ứng dụng

### 1. Cấu hình Backend (Spring Boot)
1. Cài đặt JDK (Java Development Kit 17 trở lên).
2. Tạo cơ sở dữ liệu MySQL mới (ví dụ tên là `hotel_db`).
3. Mở file `HotelBookingWeb_BE/src/main/resources/application.properties` (hoặc tệp properties tương ứng của bạn) và cập nhật thông tin kết nối DB của bạn:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/hotel_db?useSSL=false&serverTimezone=UTC
   spring.datasource.username=YOUR_MYSQL_USERNAME
   spring.datasource.password=YOUR_MYSQL_PASSWORD
   ```
4. Di chuyển vào thư mục backend và chạy ứng dụng Spring Boot:
   ```bash
   cd HotelBookingWeb_BE
   ./mvnw spring-boot:run
   ```
5. *(Tùy chọn)* Chạy file script SQL `insert_mock_data.sql` để khởi tạo dữ liệu mẫu về phòng và các dịch vụ.

### 2. Cấu hình Frontend (React Vite)
1. Đảm bảo đã cài đặt [Node.js](https://nodejs.org/).
2. Di chuyển vào thư mục frontend:
   ```bash
   cd -HotelBookingWeb_FE1
   ```
3. Tạo file `.env` từ file `.env.example` và điều chỉnh API URL nếu backend chạy trên port khác:
   ```bash
   cp .env.example .env
   ```
4. Cài đặt các thư viện Node:
   ```bash
   npm install
   ```
5. Chạy giao diện Front-end ở môi trường local phát triển:
   ```bash
   npm run dev
   ```
6. Truy cập địa chỉ hiển thị trên terminal (thông thường là `http://localhost:5173`) để trải nghiệm ứng dụng.

---
