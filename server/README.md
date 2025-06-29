# Job Portal Backend API

## Tổng quan

Backend API cho hệ thống tuyển dụng việc làm, cung cấp các chức năng quản lý người dùng, tin tuyển dụng, ứng tuyển, CV và thông tin công ty.

## Công nghệ sử dụng

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM cho MongoDB
- **JWT** - Authentication
- **bcrypt** - Mã hóa mật khẩu
- **multer** - Upload file
- **nodemailer** - Gửi email

## Cấu trúc dự án

```
BE_khoaluan/
├── controllers/          # Controllers xử lý logic
│   ├── AuthController.js
│   ├── UserController.js
│   ├── JobController.js
│   ├── CVController.js
│   ├── ApplicationController.js
│   └── CompanyController.js
├── models/              # Models định nghĩa schema
│   ├── Auth.js
│   ├── Users.js
│   ├── Candidates.js
│   ├── Employers.js
│   ├── Jobs.js
│   ├── Applications.js
│   ├── Resumes.js
│   ├── CompanyReviews.js
│   ├── Notifications.js
│   └── ...
├── routers/             # Routes định nghĩa endpoints
│   ├── auth.router.js
│   ├── user.router.js
│   ├── job.router.js
│   ├── cv.router.js
│   ├── application.router.js
│   ├── company.router.js
│   └── index.js
├── middleware/          # Middleware
│   └── auth.js
├── uploads/            # Thư mục lưu file upload
├── server.js           # Entry point
├── package.json
└── README.md
```

## Cài đặt và chạy

### Yêu cầu hệ thống

- Node.js (v14 trở lên)
- MongoDB
- npm hoặc yarn

### Cài đặt dependencies

```bash
npm install
```

### Cấu hình môi trường

Tạo file `.env` với các biến môi trường:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/job_portal
JWT_SECRET=your_jwt_secret_key
FRONTEND_URL=http://localhost:3000
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
```

### Chạy ứng dụng

```bash
# Development
npm run dev

# Production
npm start
```

## API Documentation

### Base URL

```
http://localhost:3000/api
```

### Các module API

#### 1. Authentication API

- **Base URL**: `/auth`
- **Documentation**: [API_AUTH.md](./API_AUTH.md)
- **Chức năng**: Đăng ký, đăng nhập, quản lý mật khẩu

#### 2. User Management API

- **Base URL**: `/user`
- **Documentation**: [API_USER.md](./API_USER.md)
- **Chức năng**: Quản lý thông tin người dùng, thông báo

#### 3. Job Management API

- **Base URL**: `/jobs`
- **Documentation**: [API_JOB.md](./API_JOB.md)
- **Chức năng**: Quản lý tin tuyển dụng, tìm kiếm, lọc

#### 4. CV Management API

- **Base URL**: `/cv`
- **Documentation**: [API_CV.md](./API_CV.md)
- **Chức năng**: Quản lý CV, upload file, thành phần CV

#### 5. Application Management API

- **Base URL**: `/applications`
- **Documentation**: [API_APPLICATION.md](./API_APPLICATION.md)
- **Chức năng**: Quản lý ứng tuyển, yêu thích, trạng thái

#### 6. Company Management API

- **Base URL**: `/companies`
- **Documentation**: [API_COMPANY.md](./API_COMPANY.md)
- **Chức năng**: Quản lý thông tin công ty, đánh giá, thống kê

## Vai trò người dùng

### 1. Ứng viên (Candidate)

- Quản lý thông tin cá nhân
- Tạo và quản lý CV
- Tìm kiếm và ứng tuyển việc làm
- Xem lịch sử ứng tuyển
- Đánh giá công ty
- Quản lý thông báo

### 2. Nhà tuyển dụng (Employer)

- Quản lý thông tin công ty
- Đăng tin tuyển dụng
- Quản lý đơn ứng tuyển
- Xem thống kê và báo cáo
- Cập nhật trạng thái ứng tuyển

## Tính năng chính

### 🔐 Authentication & Authorization

- JWT-based authentication
- Role-based access control
- Password encryption với bcrypt
- Forgot/Reset password
- Email verification

### 👥 User Management

- Profile management cho ứng viên và nhà tuyển dụng
- Social media links
- Account settings
- Notification system

### 💼 Job Management

- CRUD operations cho tin tuyển dụng
- Advanced search và filtering
- Job categories và tags
- Featured jobs
- Job sharing
- Job reporting

### 📄 CV Management

- Multiple CVs per candidate
- Rich text sections (education, experience, skills, etc.)
- File upload (PDF, DOC, DOCX)
- CV templates
- Primary CV selection

### 📋 Application Management

- Job application submission
- Application status tracking
- Favorite jobs
- Application history
- Status updates với notifications

### 🏢 Company Management

- Company profile management
- Company reviews và ratings
- Company search
- Industry và company size filters
- Company statistics

### 📊 Analytics & Reporting

- Job statistics
- Application analytics
- Company performance metrics
- User activity tracking

## Database Schema

### Collections chính

- **Auth**: Thông tin đăng nhập
- **Users**: Thông tin cơ bản người dùng
- **Candidates**: Thông tin chi tiết ứng viên
- **Employers**: Thông tin chi tiết nhà tuyển dụng
- **Jobs**: Tin tuyển dụng
- **Applications**: Đơn ứng tuyển
- **Resumes**: CV của ứng viên
- **CompanyReviews**: Đánh giá công ty
- **Notifications**: Thông báo
- **JobReports**: Báo cáo tin tuyển dụng

## Security Features

- JWT token authentication
- Password hashing với bcrypt
- Input validation và sanitization
- File upload security
- Rate limiting
- CORS configuration

## Error Handling

- Centralized error handling
- Custom error messages
- HTTP status codes
- Error logging

## File Upload

- Hỗ trợ PDF, DOC, DOCX
- File size limits
- Secure file storage
- File validation

## Email Integration

- Password reset emails
- Application notifications
- Welcome emails
- Status update notifications

## Performance Optimization

- Database indexing
- Query optimization
- Pagination
- Caching strategies

## Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## Deployment

```bash
# Build for production
npm run build

# Start production server
npm start
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

Nếu có vấn đề hoặc câu hỏi, vui lòng tạo issue hoặc liên hệ team development.
