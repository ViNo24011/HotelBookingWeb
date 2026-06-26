-- =========================================================================
-- SQL Script: Seed Mock Data for Hotel Booking Web Application
-- This script inserts:
--   - 2 Roles (ROLE_USER, ROLE_ADMIN) - if not already created
--   - 5 Room Types (Standard, Superior, Deluxe, Suite, Executive Suite)
--   - 25 Rooms (5 rooms per Room Type)
--   - 9 Services (Buffet, Laundry, Spa, Airport Transfer, etc.)
--   - 50 Users (All with BCrypt password "123456" for easy login)
--   - User-Role relations (assigning roles to users)
--   - RoomType-Service relations (free services for premium room types)
--   - 12 Bookings (Completed between March 1 and May 15, 2026)
--   - 12 Booking Rooms (Room details for each booking)
--   - 17 Booking Services (Services used in bookings, free or paid)
--   - 12 Reviews (One review per booking, with ratings 3-5 stars)
--   - 17 Review Votes (Upvotes/Downvotes on reviews to show helpful scores)
-- =========================================================================

-- Disable foreign key checks to allow clean seeding/truncation
SET FOREIGN_KEY_CHECKS = 0;

-- Optional: Clear tables before seeding to avoid duplicate key errors.
-- Uncomment the following lines if you want to reset the database.
/*
TRUNCATE TABLE review_vote;
TRUNCATE TABLE review;
TRUNCATE TABLE booking_service;
TRUNCATE TABLE booking_room;
TRUNCATE TABLE booking;
TRUNCATE TABLE user_roles;
TRUNCATE TABLE room_type_service;
TRUNCATE TABLE room;
TRUNCATE TABLE room_type;
TRUNCATE TABLE service;
TRUNCATE TABLE user;
TRUNCATE TABLE role;
*/

SET FOREIGN_KEY_CHECKS = 1;

-- 1. SEED ROLES (Matching RoleDataInitializer)
INSERT INTO `role` (`id`, `name`) VALUES
(1, 'ROLE_USER'),
(2, 'ROLE_ADMIN')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 2. SEED SERVICES (9 Services)
INSERT INTO `service` (`id`, `name`, `description`, `price`, `unit`, `is_active`) VALUES
(1, 'Buffet Sáng', 'Thưởng thức buffet sáng phong phú với các món ăn Á-Âu tại nhà hàng của khách sạn.', 150000.00, 'Lượt/Khách', 1),
(2, 'Dịch vụ Giặt ủi', 'Dịch vụ giặt khô, giặt nước và là quần áo nhanh chóng, tiện lợi.', 50000.00, 'Kg', 1),
(3, 'Spa & Massage', 'Thư giãn toàn thân với các liệu trình massage đá nóng và xông hơi thảo dược.', 500000.00, 'Giờ', 1),
(4, 'Đưa đón Sân bay', 'Xe ô tô riêng đón tiễn sân bay an toàn, đúng giờ (xe 4 chỗ hoặc 7 chỗ).', 300000.00, 'Lượt', 1),
(5, 'Cho thuê Xe máy', 'Thuê xe máy tự lái để tự do khám phá các địa điểm du lịch xung quanh.', 150000.00, 'Ngày', 1),
(6, 'Thuê Phòng Hội nghị', 'Phòng họp hiện đại, trang bị đầy đủ máy chiếu, âm thanh, ánh sáng chuyên nghiệp.', 2000000.00, 'Giờ', 1),
(7, 'Nước uống Minibar', 'Các loại nước ngọt, bia và đồ ăn nhẹ được chuẩn bị sẵn trong phòng.', 30000.00, 'Lon/Chai', 1),
(8, 'Vé Phòng Gym & Fitness', 'Sử dụng phòng tập thể hình hiện đại với đầy đủ trang thiết bị cao cấp.', 100000.00, 'Ngày', 1),
(9, 'Hướng dẫn viên Du lịch', 'Hướng dẫn viên bản địa am hiểu văn hóa và lịch sử, đồng hành cùng bạn.', 800000.00, 'Ngày', 1)
ON DUPLICATE KEY UPDATE name=VALUES(name), description=VALUES(description), price=VALUES(price), unit=VALUES(unit), is_active=VALUES(is_active);

-- 3. SEED ROOM TYPES (5 Room Types)
INSERT INTO `room_type` (`id`, `name`, `base_price`, `max_capacity`, `description`, `photo`) VALUES
(1, 'Phòng Standard (STD)', 500000.00, 2, 'Phòng tiêu chuẩn với đầy đủ tiện nghi cơ bản, phù hợp cho khách du lịch cá nhân hoặc cặp đôi. Không gian ấm cúng, có cửa sổ nhỏ hướng giếng trời.', NULL),
(2, 'Phòng Superior (SUP)', 800000.00, 2, 'Phòng có diện tích rộng hơn, trang thiết bị hiện đại, tầm nhìn thoáng đãng. Thiết kế hiện đại, hướng thành phố hoặc sân vườn.', NULL),
(3, 'Phòng Deluxe (DLX)', 1200000.00, 3, 'Phòng sang trọng với ban công rộng, view đẹp, thích hợp cho gia đình nhỏ hoặc nghỉ dưỡng. Ban công rộng rãi hướng hồ bơi hoặc biển, bồn tắm nằm riêng biệt.', NULL),
(4, 'Phòng Suite (SUI)', 2000000.00, 4, 'Phòng cao cấp bậc nhất với phòng khách và phòng ngủ riêng biệt, dịch vụ ưu tiên đặc biệt. Diện tích lớn, sofa tiếp khách, quầy bar nhỏ và nhiều tiện ích cao cấp.', NULL),
(5, 'Phòng Executive Suite (EXE)', 3500000.00, 4, 'Phòng Tổng thống siêu sang, đẳng cấp hoàng gia, nội thất dát vàng, tầm nhìn panorama 360 độ. Đẳng cấp hoàng gia, tích hợp phòng làm việc, phòng xông hơi riêng và quản gia phục vụ 24/7.', NULL)
ON DUPLICATE KEY UPDATE name=VALUES(name), base_price=VALUES(base_price), max_capacity=VALUES(max_capacity), description=VALUES(description);

-- 4. SEED ROOMS (25 Rooms, 5 rooms per Room Type)
INSERT INTO `room` (`id`, `room_type_id`, `room_number`, `price`) VALUES
-- Standard (Type 1)
(1, 1, '101', 500000.00),
(2, 1, '102', 500000.00),
(3, 1, '103', 500000.00),
(4, 1, '104', 500000.00),
(5, 1, '105', 500000.00),
-- Superior (Type 2)
(6, 2, '201', 800000.00),
(7, 2, '202', 800000.00),
(8, 2, '203', 800000.00),
(9, 2, '204', 800000.00),
(10, 2, '205', 800000.00),
-- Deluxe (Type 3)
(11, 3, '301', 1200000.00),
(12, 3, '302', 1200000.00),
(13, 3, '303', 1200000.00),
(14, 3, '304', 1200000.00),
(15, 3, '305', 1200000.00),
-- Suite (Type 4)
(16, 4, '401', 2000000.00),
(17, 4, '402', 2000000.00),
(18, 4, '403', 2000000.00),
(19, 4, '404', 2000000.00),
(20, 4, '405', 2000000.00),
-- Executive Suite (Type 5)
(21, 5, '501', 3500000.00),
(22, 5, '502', 3500000.00),
(23, 5, '503', 3500000.00),
(24, 5, '504', 3500000.00),
(25, 5, '505', 3500000.00)
ON DUPLICATE KEY UPDATE room_type_id=VALUES(room_type_id), room_number=VALUES(room_number), price=VALUES(price);

-- 5. SEED USERS (50 Users, Password for all is "123456")
-- Hashed password: $2a$10$wKxpy5QpxH2W5eZJ7kZgDe.7Jp3fIexV2xQ8O1lR5K1bQv2kS.e0W
INSERT INTO `user` (`id`, `first_name`, `last_name`, `email`, `password`, `loyalty_points`) VALUES
(1, 'Anh Tuấn', 'Nguyễn', 'tuan.nguyen@gmail.com', '$2a$10$wKxpy5QpxH2W5eZJ7kZgDe.7Jp3fIexV2xQ8O1lR5K1bQv2kS.e0W', 120),
(2, 'Minh Khang', 'Trần', 'khang.tran@gmail.com', '$2a$10$wKxpy5QpxH2W5eZJ7kZgDe.7Jp3fIexV2xQ8O1lR5K1bQv2kS.e0W', 450),
(3, 'Minh Triết', 'Lê', 'triet.le@gmail.com', '$2a$10$wKxpy5QpxH2W5eZJ7kZgDe.7Jp3fIexV2xQ8O1lR5K1bQv2kS.e0W', 80),
(4, 'Khánh An', 'Phạm', 'an.pham@gmail.com', '$2a$10$wKxpy5QpxH2W5eZJ7kZgDe.7Jp3fIexV2xQ8O1lR5K1bQv2kS.e0W', 0),
(5, 'Gia Huy', 'Hoàng', 'huy.hoang@gmail.com', '$2a$10$wKxpy5QpxH2W5eZJ7kZgDe.7Jp3fIexV2xQ8O1lR5K1bQv2kS.e0W', 310),
(6, 'Hoàng Long', 'Phan', 'long.phan@gmail.com', '$2a$10$wKxpy5QpxH2W5eZJ7kZgDe.7Jp3fIexV2xQ8O1lR5K1bQv2kS.e0W', 150),
(7, 'Bảo Nam', 'Vũ', 'nam.vu@gmail.com', '$2a$10$wKxpy5QpxH2W5eZJ7kZgDe.7Jp3fIexV2xQ8O1lR5K1bQv2kS.e0W', 250),
(8, 'Hữu Đạt', 'Võ', 'dat.vo@gmail.com', '$2a$10$wKxpy5QpxH2W5eZJ7kZgDe.7Jp3fIexV2xQ8O1lR5K1bQv2kS.e0W', 90),
(9, 'Nhật Nam', 'Đặng', 'nam.dang@gmail.com', '$2a$10$wKxpy5QpxH2W5eZJ7kZgDe.7Jp3fIexV2xQ8O1lR5K1bQv2kS.e0W', 50),
(10, 'Minh Quân', 'Bùi', 'quan.bui@gmail.com', '$2a$10$wKxpy5QpxH2W5eZJ7kZgDe.7Jp3fIexV2xQ8O1lR5K1bQv2kS.e0W', 180),
(11, 'Đức Duy', 'Đỗ', 'duy.do@gmail.com', '$2a$10$wKxpy5QpxH2W5eZJ7kZgDe.7Jp3fIexV2xQ8O1lR5K1bQv2kS.e0W', 0),
(12, 'Thành Đạt', 'Đỗ', 'dat.do@gmail.com', '$2a$10$wKxpy5QpxH2W5eZJ7kZgDe.7Jp3fIexV2xQ8O1lR5K1bQv2kS.e0W', 60),
(13, 'Thanh Hải', 'Hồ', 'hai.ho@gmail.com', '$2a$10$wKxpy5QpxH2W5eZJ7kZgDe.7Jp3fIexV2xQ8O1lR5K1bQv2kS.e0W', 210),
(14, 'Minh Đăng', 'Ngô', 'dang.ngo@gmail.com', '$2a$10$wKxpy5QpxH2W5eZJ7kZgDe.7Jp3fIexV2xQ8O1lR5K1bQv2kS.e0W', 15),
(15, 'Quang Huy', 'Dương', 'huy.duong@gmail.com', '$2a$10$wKxpy5QpxH2W5eZJ7kZgDe.7Jp3fIexV2xQ8O1lR5K1bQv2kS.e0W', 0),
(16, 'Ngọc Hải', 'Lý', 'hai.ly@gmail.com', '$2a$10$wKxpy5QpxH2W5eZJ7kZgDe.7Jp3fIexV2xQ8O1lR5K1bQv2kS.e0W', 130),
(17, 'Quang Dũng', 'Nguyễn', 'dung.nguyen@gmail.com', '$2a$10$wKxpy5QpxH2W5eZJ7kZgDe.7Jp3fIexV2xQ8O1lR5K1bQv2kS.e0W', 70),
(18, 'Tiến Dũng', 'Trần', 'dung.tran@gmail.com', '$2a$10$wKxpy5QpxH2W5eZJ7kZgDe.7Jp3fIexV2xQ8O1lR5K1bQv2kS.e0W', 0),
(19, 'Hoàng Nam', 'Lê', 'nam.le@gmail.com', '$2a$10$wKxpy5QpxH2W5eZJ7kZgDe.7Jp3fIexV2xQ8O1lR5K1bQv2kS.e0W', 340),
(20, 'Văn Nam', 'Phạm', 'nam.pham2@gmail.com', '$2a$10$wKxpy5QpxH2W5eZJ7kZgDe.7Jp3fIexV2xQ8O1lR5K1bQv2kS.e0W', 20),
(21, 'Hồng Nhung', 'Hoàng', 'nhung.hoang@gmail.com', '$2a$10$wKxpy5QpxH2W5eZJ7kZgDe.7Jp3fIexV2xQ8O1lR5K1bQv2kS.e0W', 150),
(22, 'Minh Vy', 'Phan', 'vy.phan@gmail.com', '$2a$10$wKxpy5QpxH2W5eZJ7kZgDe.7Jp3fIexV2xQ8O1lR5K1bQv2kS.e0W', 180),
(23, 'Lan Hương', 'Vũ', 'huong.vu@gmail.com', '$2a$10$wKxpy5QpxH2W5eZJ7kZgDe.7Jp3fIexV2xQ8O1lR5K1bQv2kS.e0W', 500),
(24, 'Phương Thảo', 'Võ', 'thao.vo@gmail.com', '$2a$10$wKxpy5QpxH2W5eZJ7kZgDe.7Jp3fIexV2xQ8O1lR5K1bQv2kS.e0W', 110),
(25, 'Mai Chi', 'Đặng', 'chi.dang@gmail.com', '$2a$10$wKxpy5QpxH2W5eZJ7kZgDe.7Jp3fIexV2xQ8O1lR5K1bQv2kS.e0W', 0),
(26, 'Linh Đan', 'Bùi', 'dan.bui@gmail.com', '$2a$10$wKxpy5QpxH2W5eZJ7kZgDe.7Jp3fIexV2xQ8O1lR5K1bQv2kS.e0W', 40),
(27, 'Tuyết Mai', 'Đỗ', 'mai.do@gmail.com', '$2a$10$wKxpy5QpxH2W5eZJ7kZgDe.7Jp3fIexV2xQ8O1lR5K1bQv2kS.e0W', 95),
(28, 'Quỳnh Chi', 'Hồ', 'chi.ho@gmail.com', '$2a$10$wKxpy5QpxH2W5eZJ7kZgDe.7Jp3fIexV2xQ8O1lR5K1bQv2kS.e0W', 0),
(29, 'Ngọc Anh', 'Ngô', 'anh.ngo@gmail.com', '$2a$10$wKxpy5QpxH2W5eZJ7kZgDe.7Jp3fIexV2xQ8O1lR5K1bQv2kS.e0W', 160),
(30, 'Trà My', 'Dương', 'my.duong@gmail.com', '$2a$10$wKxpy5QpxH2W5eZJ7kZgDe.7Jp3fIexV2xQ8O1lR5K1bQv2kS.e0W', 80),
(31, 'Thảo Nguyên', 'Lý', 'nguyen.ly@gmail.com', '$2a$10$wKxpy5QpxH2W5eZJ7kZgDe.7Jp3fIexV2xQ8O1lR5K1bQv2kS.e0W', 220),
(32, 'Bảo Châu', 'Nguyễn', 'chau.nguyen@gmail.com', '$2a$10$wKxpy5QpxH2W5eZJ7kZgDe.7Jp3fIexV2xQ8O1lR5K1bQv2kS.e0W', 140),
(33, 'Khánh Linh', 'Trần', 'linh.tran@gmail.com', '$2a$10$wKxpy5QpxH2W5eZJ7kZgDe.7Jp3fIexV2xQ8O1lR5K1bQv2kS.e0W', 300),
(34, 'Hải Yến', 'Lê', 'yen.le@gmail.com', '$2a$10$wKxpy5QpxH2W5eZJ7kZgDe.7Jp3fIexV2xQ8O1lR5K1bQv2kS.e0W', 50),
(35, 'Thanh Hằng', 'Phạm', 'hang.pham@gmail.com', '$2a$10$wKxpy5QpxH2W5eZJ7kZgDe.7Jp3fIexV2xQ8O1lR5K1bQv2kS.e0W', 0),
(36, 'Ngọc Trinh', 'Hoàng', 'trinh.hoang@gmail.com', '$2a$10$wKxpy5QpxH2W5eZJ7kZgDe.7Jp3fIexV2xQ8O1lR5K1bQv2kS.e0W', 75),
(37, 'Mỹ Tâm', 'Phan', 'tam.phan@gmail.com', '$2a$10$wKxpy5QpxH2W5eZJ7kZgDe.7Jp3fIexV2xQ8O1lR5K1bQv2kS.e0W', 480),
(38, 'Minh Hằng', 'Vũ', 'hang.vu2@gmail.com', '$2a$10$wKxpy5QpxH2W5eZJ7kZgDe.7Jp3fIexV2xQ8O1lR5K1bQv2kS.e0W', 190),
(39, 'Lan Khuê', 'Võ', 'khue.vo@gmail.com', '$2a$10$wKxpy5QpxH2W5eZJ7kZgDe.7Jp3fIexV2xQ8O1lR5K1bQv2kS.e0W', 30),
(40, 'Thu Trang', 'Đặng', 'trang.dang@gmail.com', '$2a$10$wKxpy5QpxH2W5eZJ7kZgDe.7Jp3fIexV2xQ8O1lR5K1bQv2kS.e0W', 150),
(41, 'Thu Hương', 'Bùi', 'huong.bui@gmail.com', '$2a$10$wKxpy5QpxH2W5eZJ7kZgDe.7Jp3fIexV2xQ8O1lR5K1bQv2kS.e0W', 110),
(42, 'Thu Thảo', 'Đỗ', 'thao.do@gmail.com', '$2a$10$wKxpy5QpxH2W5eZJ7kZgDe.7Jp3fIexV2xQ8O1lR5K1bQv2kS.e0W', 320),
(43, 'Kiều Trang', 'Hồ', 'trang.ho@gmail.com', '$2a$10$wKxpy5QpxH2W5eZJ7kZgDe.7Jp3fIexV2xQ8O1lR5K1bQv2kS.e0W', 45),
(44, 'Kim Ngân', 'Ngô', 'ngan.ngo@gmail.com', '$2a$10$wKxpy5QpxH2W5eZJ7kZgDe.7Jp3fIexV2xQ8O1lR5K1bQv2kS.e0W', 90),
(45, 'Diễm My', 'Dương', 'my.duong2@gmail.com', '$2a$10$wKxpy5QpxH2W5eZJ7kZgDe.7Jp3fIexV2xQ8O1lR5K1bQv2kS.e0W', 260),
(46, 'Nhã Phương', 'Lý', 'phuong.ly@gmail.com', '$2a$10$wKxpy5QpxH2W5eZJ7kZgDe.7Jp3fIexV2xQ8O1lR5K1bQv2kS.e0W', 130),
(47, 'Quỳnh Hương', 'Nguyễn', 'huong.nguyen@gmail.com', '$2a$10$wKxpy5QpxH2W5eZJ7kZgDe.7Jp3fIexV2xQ8O1lR5K1bQv2kS.e0W', 0),
(48, 'Khánh Vy', 'Trần', 'vy.tran@gmail.com', '$2a$10$wKxpy5QpxH2W5eZJ7kZgDe.7Jp3fIexV2xQ8O1lR5K1bQv2kS.e0W', 380),
(49, 'Phương Anh', 'Lê', 'anh.le@gmail.com', '$2a$10$wKxpy5QpxH2W5eZJ7kZgDe.7Jp3fIexV2xQ8O1lR5K1bQv2kS.e0W', 70),
(50, 'Vân Anh', 'Phạm', 'anh.pham2@gmail.com', '$2a$10$wKxpy5QpxH2W5eZJ7kZgDe.7Jp3fIexV2xQ8O1lR5K1bQv2kS.e0W', 10)
ON DUPLICATE KEY UPDATE first_name=VALUES(first_name), last_name=VALUES(last_name), password=VALUES(password), loyalty_points=VALUES(loyalty_points);

-- 6. SEED USER-ROLE RELATIONSHIPS (All users get ROLE_USER, user 1 and 2 also get ROLE_ADMIN)
INSERT INTO `user_roles` (`user_id`, `role_id`) VALUES
(1, 1), (1, 2), -- User 1 has both ROLE_USER and ROLE_ADMIN
(2, 1), (2, 2), -- User 2 has both ROLE_USER and ROLE_ADMIN
(3, 1), (4, 1), (5, 1), (6, 1), (7, 1), (8, 1), (9, 1), (10, 1),
(11, 1), (12, 1), (13, 1), (14, 1), (15, 1), (16, 1), (17, 1), (18, 1), (19, 1), (20, 1),
(21, 1), (22, 1), (23, 1), (24, 1), (25, 1), (26, 1), (27, 1), (28, 1), (29, 1), (30, 1),
(31, 1), (32, 1), (33, 1), (34, 1), (35, 1), (36, 1), (37, 1), (38, 1), (39, 1), (40, 1),
(41, 1), (42, 1), (43, 1), (44, 1), (45, 1), (46, 1), (47, 1), (48, 1), (49, 1), (50, 1)
ON DUPLICATE KEY UPDATE role_id=VALUES(role_id);

-- 7. SEED ROOM-TYPE SERVICES (Linking free services to premium room types)
INSERT INTO `room_type_service` (`room_type_id`, `service_id`) VALUES
(3, 1), (3, 8), -- Deluxe (3) free Buffet (1) + Gym (8)
(4, 1), (4, 4), (4, 8), -- Suite (4) free Buffet (1) + Airport Transfer (4) + Gym (8)
(5, 1), (5, 3), (5, 4), (5, 8) -- Executive Suite (5) free Buffet (1) + Spa (3) + Airport Transfer (4) + Gym (8)
ON DUPLICATE KEY UPDATE service_id=VALUES(service_id);

-- 8. SEED BOOKINGS (12 Completed Bookings from March 1 to May 15, 2026)
INSERT INTO `booking` (`id`, `user_id`, `guest_email`, `check_in`, `check_out`, `guest_name`, `confirmation_code`, `total_amount`, `total_guests`, `status`, `created_at`, `points_earned`, `points_used`, `discount_amount`) VALUES
(1, 3, 'triet.le@gmail.com', '2026-03-05', '2026-03-08', 'Lê Minh Triết', '1077124600', 1950000.00, 2, 'COMPLETED', '2026-03-02 14:30:00', 19, 0, 0.00),
(2, 5, 'huy.hoang@gmail.com', '2026-03-12', '2026-03-14', 'Hoàng Gia Huy', '6081744551', 2020000.00, 3, 'COMPLETED', '2026-03-10 09:15:00', 20, 0, 0.00),
(3, 7, 'nam.vu@gmail.com', '2026-03-20', '2026-03-25', 'Vũ Bảo Nam', '6075696601', 7000000.00, 3, 'COMPLETED', '2026-03-15 18:20:00', 70, 0, 0.00),
(4, 10, 'quan.bui@gmail.com', '2026-04-01', '2026-04-03', 'Bùi Minh Quân', '2026040104', 4800000.00, 4, 'COMPLETED', '2026-03-28 11:10:00', 48, 0, 0.00),
(5, 13, 'hai.ho@gmail.com', '2026-04-10', '2026-04-12', 'Hồ Thanh Hải', '2026041005', 11000000.00, 4, 'COMPLETED', '2026-04-05 09:00:00', 110, 0, 0.00),
(6, 16, 'hai.ly@gmail.com', '2026-04-15', '2026-04-17', 'Lý Ngọc Hải', '2026041506', 1300000.00, 1, 'COMPLETED', '2026-04-14 15:45:00', 13, 0, 0.00),
(7, 21, 'nhung.hoang@gmail.com', '2026-04-20', '2026-04-22', 'Hoàng Hồng Nhung', '5077240313', 1900000.00, 2, 'COMPLETED', '2026-04-18 10:20:00', 19, 0, 0.00),
(8, 26, 'dan.bui@gmail.com', '2026-04-25', '2026-04-28', 'Bùi Linh Đan', '2026042508', 4100000.00, 3, 'COMPLETED', '2026-04-22 17:00:00', 41, 0, 0.00),
(9, 31, 'nguyen.ly@gmail.com', '2026-05-01', '2026-05-04', 'Lý Thảo Nguyên', '1754823819', 6000000.00, 4, 'COMPLETED', '2026-04-29 08:30:00', 60, 0, 0.00),
(10, 37, 'tam.phan@gmail.com', '2026-05-05', '2026-05-08', 'Phan Mỹ Tâm', '2026050510', 10500000.00, 3, 'COMPLETED', '2026-05-01 14:00:00', 105, 0, 0.00),
(11, 42, 'thao.do@gmail.com', '2026-05-10', '2026-05-13', 'Đỗ Thu Thảo', '2026051011', 2850000.00, 2, 'COMPLETED', '2026-05-08 20:00:00', 28, 0, 0.00),
(12, 48, 'vy.tran@gmail.com', '2026-05-12', '2026-05-15', 'Trần Khánh Vy', '2026051212', 3750000.00, 2, 'COMPLETED', '2026-05-10 10:00:00', 37, 0, 0.00)
ON DUPLICATE KEY UPDATE user_id=VALUES(user_id), guest_email=VALUES(guest_email), check_in=VALUES(check_in), check_out=VALUES(check_out), guest_name=VALUES(guest_name), total_amount=VALUES(total_amount), total_guests=VALUES(total_guests), status=VALUES(status);

-- 9. SEED BOOKING ROOMS (Room details for each booking)
INSERT INTO `booking_room` (`id`, `booking_id`, `room_id`, `price_at_booking`, `num_adults`, `num_children`) VALUES
(1, 1, 3, 500000.00, 2, 0), -- Booking 1 (3 nights, Room 103 Standard)
(2, 2, 8, 800000.00, 2, 1), -- Booking 2 (2 nights, Room 203 Superior)
(3, 3, 12, 1200000.00, 3, 0), -- Booking 3 (5 nights, Room 302 Deluxe)
(4, 4, 18, 2000000.00, 2, 2), -- Booking 4 (2 nights, Room 403 Suite)
(5, 5, 22, 3500000.00, 4, 0), -- Booking 5 (2 nights, Room 502 Executive Suite)
(6, 6, 2, 500000.00, 1, 0), -- Booking 6 (2 nights, Room 102 Standard)
(7, 7, 7, 800000.00, 2, 0), -- Booking 7 (2 nights, Room 202 Superior)
(8, 8, 13, 1200000.00, 2, 1), -- Booking 8 (3 nights, Room 303 Deluxe)
(9, 9, 19, 2000000.00, 4, 0), -- Booking 9 (3 nights, Room 404 Suite)
(10, 10, 23, 3500000.00, 3, 0), -- Booking 10 (3 nights, Room 503 Executive Suite)
(11, 11, 9, 800000.00, 2, 0), -- Booking 11 (3 nights, Room 204 Superior)
(12, 12, 14, 1200000.00, 2, 0) -- Booking 12 (3 nights, Room 304 Deluxe)
ON DUPLICATE KEY UPDATE booking_id=VALUES(booking_id), room_id=VALUES(room_id), price_at_booking=VALUES(price_at_booking);

-- 10. SEED BOOKING SERVICES (Services used in bookings, including free ones)
INSERT INTO `booking_service` (`id`, `booking_id`, `service_id`, `quantity`, `price_at_time`) VALUES
-- Booking 1
(1, 1, 1, 2, 150000.00), -- Buffet Sáng (Paid)
(2, 1, 2, 3, 50000.00),  -- Giặt ủi (Paid)
-- Booking 2
(3, 2, 4, 1, 300000.00), -- Đưa đón Sân bay (Paid)
(4, 2, 7, 4, 30000.00),  -- Minibar (Paid)
-- Booking 3
(5, 3, 1, 3, 0.00),      -- Buffet Sáng (Free for Deluxe)
(6, 3, 3, 2, 500000.00), -- Spa (Paid)
-- Booking 4
(7, 4, 1, 2, 0.00),      -- Buffet Sáng (Free for Suite)
(8, 4, 4, 2, 0.00),      -- Airport Transfer (Free for Suite)
(9, 4, 8, 2, 0.00),      -- Gym (Free for Suite)
(10, 4, 9, 1, 800000.00), -- Tour Guide (Paid)
-- Booking 5
(11, 5, 1, 4, 0.00),     -- Buffet Sáng (Free for Executive Suite)
(12, 5, 3, 1, 0.00),     -- Spa (Free for Executive Suite)
(13, 5, 4, 1, 0.00),     -- Airport Transfer (Free for Executive Suite)
(14, 5, 8, 4, 0.00),     -- Gym (Free for Executive Suite)
(15, 5, 6, 2, 2000000.00), -- Conference Room (Paid)
-- Booking 6
(16, 6, 5, 2, 150000.00), -- Cho thuê xe máy (Paid)
-- Booking 8
(17, 8, 1, 2, 0.00),     -- Buffet Sáng (Free for Deluxe)
(18, 8, 3, 1, 500000.00), -- Spa (Paid)
-- Booking 9
(19, 9, 1, 4, 0.00),     -- Buffet Sáng (Free for Suite)
(20, 9, 4, 1, 0.00),     -- Airport Transfer (Free for Suite)
-- Booking 10
(21, 10, 1, 3, 0.00),    -- Buffet Sáng (Free for Executive Suite)
(22, 10, 3, 1, 0.00),    -- Spa (Free for Executive Suite)
(23, 10, 4, 1, 0.00),    -- Airport Transfer (Free for Executive Suite)
-- Booking 11
(24, 11, 5, 3, 150000.00), -- Cho thuê xe máy (Paid)
-- Booking 12
(25, 12, 1, 2, 0.00),    -- Buffet Sáng (Free for Deluxe)
(26, 12, 7, 5, 30000.00) -- Minibar (Paid)
ON DUPLICATE KEY UPDATE booking_id=VALUES(booking_id), service_id=VALUES(service_id), quantity=VALUES(quantity), price_at_time=VALUES(price_at_time);

-- 11. SEED REVIEWS (12 reviews associated with completed bookings)
INSERT INTO `review` (`id`, `user_id`, `room_type_id`, `booking_id`, `rating`, `comment`, `created_at`) VALUES
(1, 3, 1, 1, 5, 'Phòng Standard sạch sẽ, ấm cúng. Nhân viên phục vụ rất nhiệt tình, buffet sáng ngon.', '2026-03-08 11:30:00'),
(2, 5, 2, 2, 4, 'Phòng Superior thoáng mát, view thành phố đẹp. Khách sạn đón tiễn sân bay đúng giờ.', '2026-03-14 12:00:00'),
(3, 7, 3, 3, 5, 'Phòng Deluxe rất rộng, ban công hướng hồ bơi tuyệt vời. Spa thư giãn tuyệt đỉnh. Chắc chắn sẽ quay lại!', '2026-03-25 10:15:00'),
(4, 10, 4, 4, 5, 'Gia đình tôi đã có trải nghiệm tuyệt vời ở phòng Suite. Dịch vụ đẳng cấp, các tiện ích đi kèm miễn phí rất tốt.', '2026-04-03 14:00:00'),
(5, 13, 5, 5, 5, 'Phòng Tổng thống siêu sang trọng, dịch vụ chuyên nghiệp, phòng họp đầy đủ thiết bị phục vụ công việc hiệu quả.', '2026-04-12 11:00:00'),
(6, 16, 1, 6, 3, 'Phòng hơi nhỏ và cách âm chưa tốt lắm. Được cái dịch vụ thuê xe máy nhanh gọn.', '2026-04-17 09:30:00'),
(7, 21, 2, 7, 4, 'Khách sạn sạch sẽ, gần trung tâm. Đồ ăn sáng ngon miệng nhưng thực đơn hơi ít món.', '2026-04-22 13:00:00'),
(8, 26, 3, 8, 5, 'Dịch vụ phòng Deluxe rất tốt, phòng sạch sẽ, hồ bơi đẹp. Bé nhà mình rất thích.', '2026-04-28 10:00:00'),
(9, 31, 4, 9, 4, 'Phòng Suite tiện nghi, không gian thoáng đãng. Tuy nhiên wifi đôi lúc hơi chập chờn.', '2026-05-04 12:00:00'),
(10, 37, 5, 10, 5, 'Chuyến nghỉ dưỡng hoàn hảo. Phòng Executive Suite đẳng cấp, phục vụ chu đáo tận tình từ lúc xuống sân bay.', '2026-05-08 10:30:00'),
(11, 42, 2, 11, 4, 'Phòng ốc sạch sẽ, nhân viên dọn dẹp hàng ngày rất kỹ. Rất hài lòng.', '2026-05-13 11:00:00'),
(12, 48, 3, 12, 5, 'Kỳ nghỉ tuyệt vời. Phòng Deluxe có view ngắm bình minh cực đẹp.', '2026-05-15 12:00:00')
ON DUPLICATE KEY UPDATE user_id=VALUES(user_id), room_type_id=VALUES(room_type_id), booking_id=VALUES(booking_id), rating=VALUES(rating), comment=VALUES(comment);

-- 12. SEED REVIEW VOTES (Helpful scores on reviews, 1 is Upvote, -1 is Downvote)
INSERT INTO `review_vote` (`user_id`, `review_id`, `vote_type`, `created_at`) VALUES
-- Review 1 Upvotes
(4, 1, 1, '2026-03-08 13:00:00'),
(5, 1, 1, '2026-03-08 14:15:00'),
-- Review 2 (1 Upvote, 1 Downvote)
(6, 2, 1, '2026-03-14 15:00:00'),
(7, 2, -1, '2026-03-14 16:30:00'),
-- Review 3 Upvotes
(8, 3, 1, '2026-03-25 11:00:00'),
(9, 3, 1, '2026-03-25 12:30:00'),
(10, 3, 1, '2026-03-25 13:45:00'),
-- Review 4 Upvotes
(11, 4, 1, '2026-04-03 16:00:00'),
(12, 4, 1, '2026-04-03 17:15:00'),
-- Review 5 Upvotes
(14, 5, 1, '2026-04-12 13:00:00'),
(15, 5, 1, '2026-04-12 14:30:00'),
-- Review 6 (1 Upvote, 1 Downvote)
(17, 6, 1, '2026-04-17 11:00:00'),
(18, 6, -1, '2026-04-17 12:30:00'),
-- Review 8 Upvotes
(27, 8, 1, '2026-04-28 12:00:00'),
-- Review 10 Upvotes
(38, 10, 1, '2026-05-08 12:00:00'),
(39, 10, 1, '2026-05-08 13:15:00'),
(40, 10, 1, '2026-05-08 14:30:00')
ON DUPLICATE KEY UPDATE vote_type=VALUES(vote_type);
