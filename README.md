# CyberShare

Nền tảng blog/mạng xã hội chia sẻ bài viết (fullstack): frontend React + Vite, backend Spring Boot + MySQL.

## Tính năng chính
- Đăng ký/đăng nhập (JWT), đăng xuất
- OAuth2 Google login
- Bài viết: tạo/sửa/xóa, upload ảnh, xem theo slug, trending/feed
- Danh mục (categories), thẻ (tags), tìm kiếm (fulltext)
- Bình luận (comments)
- Tương tác: like, bookmark
- Follow tác giả + thông báo (notifications) realtime qua WebSocket (STOMP/SockJS)
- Quên mật khẩu / reset password qua email
- Admin pages (quản lý user/bài viết/categories/tags, analytics, settings)
- AI Assistant trong trang chi tiết bài viết (Gemini)

## Tech stack
**Client**
- React 18, Vite 5, React Router
- TailwindCSS
- Axios
- SockJS + STOMP (nhận thông báo realtime)

**Server**
- Java 17, Spring Boot 3.5.x
- Spring Web, Spring Security, OAuth2 Client
- Spring Data JPA
- MySQL + Flyway migrations
- WebSocket (STOMP message broker)
- Spring Mail (Gmail SMTP)
- Springdoc OpenAPI (Swagger UI)

## Cấu trúc thư mục
- `client/`: frontend (Vite)
- `server/`: backend (Spring Boot)
- `server/src/main/resources/db/migration/`: Flyway migrations
- `server/uploads/`: nơi lưu file upload (avatars, ảnh bài viết)

## Yêu cầu hệ thống
- Node.js 18+ (khuyến nghị 18/20)
- Java 17
- MySQL 8.x (hoặc compatible)

## Cấu hình

### 1) Database (MySQL)
Backend mặc định kết nối database `cybershare` trên localhost.

- Chạy MySQL và tạo user/password phù hợp.
- Dự án có cấu hình `createDatabaseIfNotExist=true` (dev), nên DB có thể tự tạo nếu quyền cho phép.

Bạn có thể chỉnh DB trong:
- `server/src/main/resources/application-dev.properties`

Lưu ý: repo hiện đang có một số giá trị ví dụ (password/keys). **Nên thay đổi và không commit secrets**.

### 2) Backend config (Spring Boot)
Profile mặc định: `dev` (xem `server/src/main/resources/application.properties`).

Các cấu hình đáng chú ý (dev):
- Port: `8080`
- CORS: cho phép `http://localhost:5173` (Vite dev)
- Upload dirs:
  - Avatars: `uploads/avatars`
  - Post images: `uploads/posts`
- Swagger UI: public

**Production**
File `server/src/main/resources/application-prod.properties` dùng biến môi trường:
- `DATABASE_URL`
- `DATABASE_USERNAME`
- `DATABASE_PASSWORD`
- `JWT_SECRET`
- `CORS_ALLOWED_ORIGINS`

### 3) Frontend config (Vite)
Frontend gọi backend qua `VITE_API_URL`.

Tạo (hoặc sửa) file `client/.env`:
```env
VITE_API_URL=http://localhost:8080
# (tuỳ chọn) dùng AI Assistant
VITE_GEMINI_API_KEY=your_gemini_api_key
```

Ghi chú:
- Trong UI có thể đổi API base URL và được lưu vào `localStorage` (mục About).

## Chạy dự án (Dev)

### 1) Chạy Backend
Mở PowerShell tại thư mục `server/`:
```powershell
cd server
.\mvnw.cmd spring-boot:run
```

Backend chạy tại:
- API: http://localhost:8080
- Swagger UI: http://localhost:8080/swagger-ui/index.html
- OpenAPI JSON: http://localhost:8080/v3/api-docs
- Health check (public): http://localhost:8080/api/health
- Actuator health (public): http://localhost:8080/actuator/health

### 2) Chạy Frontend
Mở PowerShell tại thư mục `client/`:
```powershell
cd client
npm install
npm run dev
```

Frontend chạy tại (mặc định):
- http://localhost:5173

## WebSocket (Notifications)
- STOMP endpoint: `http://localhost:8080/ws`
- Application destination prefix: `/app`
- User queue notifications (client subscribe): `/user/{username}/queue/notifications`

Ghi chú: client hiện kết nối WS bằng URL hardcode `http://localhost:8080/ws`.

## Build & chạy dạng Production

### Client build
```powershell
cd client
npm run build
npm run preview
```

Output nằm ở `client/dist/`.

### Server build
```powershell
cd server
.\mvnw.cmd clean package
```

Chạy file jar (ví dụ):
```powershell
cd server
$env:SPRING_PROFILES_ACTIVE="prod"
$env:DATABASE_URL="jdbc:mysql://localhost:3306/cybershare?useSSL=true&serverTimezone=UTC"
$env:DATABASE_USERNAME="root"
$env:DATABASE_PASSWORD="your_password"
$env:JWT_SECRET="your_long_random_secret"
$env:CORS_ALLOWED_ORIGINS="https://your-frontend-domain"
java -jar .\target\server-0.0.1-SNAPSHOT.jar
```

## Troubleshooting
- **CORS error**: đảm bảo `app.cors.allowed-origins` chứa đúng origin frontend (`http://localhost:5173`).
- **Không kết nối DB**: kiểm tra MySQL đang chạy, user/password trong `application-dev.properties`.
- **Flyway lỗi migration**: kiểm tra scripts trong `server/src/main/resources/db/migration/` và cấu hình Flyway (dev có `baseline-on-migrate=true`).
- **Email reset password không gửi**: cần cấu hình SMTP hợp lệ (Gmail thường cần App Password).
- **AI Assistant không hoạt động**: cần `VITE_GEMINI_API_KEY` trong `client/.env` và restart dev server.

## Tài liệu
- SRS và các tài liệu liên quan nằm ở thư mục gốc (ví dụ: `SRS.md`, `sequenceDiagram.md`).
