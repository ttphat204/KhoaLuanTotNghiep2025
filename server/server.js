const express = require('express');
const cors = require('cors');

const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Cấu hình CORS để cho phép tất cả origins
app.use(cors({
  origin: ['http://localhost:5173', 'https://be-khoaluan.vercel.app', 'https://khoaluanai.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token'],
  credentials: true
}));
app.options('*', cors()); // Đảm bảo trả về phản hồi hợp lệ cho mọi preflight request

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import và sử dụng các routes
const uploadLogoRouter = require('./api/upload/logo');
const candidateProfileRouter = require('./api/candidate/profile');
const authRouter = require('./routers/auth.router');
const userRouter = require('./routers/user.router');
const jobRouter = require('./routers/job.router');
const companyRouter = require('./routers/company.router');
const cvRouter = require('./routers/cv.router');
const applicationRouter = require('./routers/application.router');
const interviewRouter = require('./routers/interview.router');
const notificationRouter = require('./routers/notification.router');
const adminRouter = require('./routers/admin.router');

// Sử dụng các routes - đặt upload lên đầu
app.use('/api/upload/logo', uploadLogoRouter);
app.use('/api/candidate/profile', candidateProfileRouter);
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/job', jobRouter);
app.use('/api/company', companyRouter);
app.use('/api/cv', cvRouter);
app.use('/api/application', applicationRouter);
app.use('/api/interview', interviewRouter);
app.use('/api/notification', notificationRouter);
app.use('/api/admin', adminRouter);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Trang chủ
app.get('/', (req, res) => {
  res.send('<h2>Server đang chạy! API đã sẵn sàng sử dụng.</h2>');
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
}); 