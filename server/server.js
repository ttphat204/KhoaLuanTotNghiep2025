const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Cấu hình CORS để cho phép tất cả origins
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token']
}));

app.use(express.json());

// Import và sử dụng các routes
const authRouter = require('./routers/auth.router');
const userRouter = require('./routers/user.router');
const jobRouter = require('./routers/job.router');
const companyRouter = require('./routers/company.router');
const cvRouter = require('./routers/cv.router');
const applicationRouter = require('./routers/application.router');
const interviewRouter = require('./routers/interview.router');
const notificationRouter = require('./routers/notification.router');

// Sử dụng các routes
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/job', jobRouter);
app.use('/api/company', companyRouter);
app.use('/api/cv', cvRouter);
app.use('/api/application', applicationRouter);
app.use('/api/interview', interviewRouter);
app.use('/api/notification', notificationRouter);

// Trang chủ
app.get('/', (req, res) => {
  res.send('<h2>Server đang chạy! API đã sẵn sàng sử dụng.</h2>');
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
}); 