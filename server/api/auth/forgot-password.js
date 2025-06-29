const dbConnect = require('../../utils/dbConnect');
const Auth = require('../../models/Auth');
const crypto = require('crypto');
const { createTransporter, getResetPasswordTemplate } = require('../../utils/emailConfig');

module.exports = async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Handle GET request - Show API info
  if (req.method === 'GET') {
    try {
      await dbConnect();
      const totalUsers = await Auth.countDocuments();
      
      return res.status(200).json({
        message: 'API Quên Mật khẩu',
        method: 'POST',
        endpoint: '/api/auth/forgot-password',
        requiredFields: ['email'],
        description: 'Gửi email reset password cho người dùng',
        databaseStats: {
          totalUsers
        },
        example: {
          email: 'example@email.com'
        }
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Lỗi khi lấy dữ liệu',
        error: error.message
      });
    }
  }

  // Handle POST request
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      message: 'Method Not Allowed',
      allowedMethods: ['GET', 'POST'],
      receivedMethod: req.method 
    });
  }

  await dbConnect();
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ 
        message: 'Vui lòng nhập email' 
      });
    }

    // Tìm user theo email
    const user = await Auth.findOne({ email });
    if (!user) {
      return res.status(404).json({ 
        message: 'Email không tồn tại trong hệ thống' 
      });
    }

    // Tạo reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Lưu token và thời gian hết hạn (1 giờ)
    user.resetPasswordToken = resetPasswordToken;
    user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 giờ
    await user.save();

    // Tạo reset URL
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;

    // Tạo transporter và gửi email
    const transporter = createTransporter();
    const userName = user.fullName || user.companyName || 'Người dùng';
    const htmlContent = getResetPasswordTemplate(userName, resetUrl);

    const mailOptions = {
      from: process.env.EMAIL_USER || 'your-email@gmail.com',
      to: email,
      subject: 'Reset Mật khẩu - Job Portal',
      html: htmlContent
    };

    // Gửi email
    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      message: 'Email reset password đã được gửi. Vui lòng kiểm tra hộp thư của bạn.',
      email: email
    });

  } catch (error) {
    console.error('Lỗi gửi email reset password:', error);
    return res.status(500).json({ 
      message: 'Lỗi khi gửi email reset password', 
      error: error.message 
    });
  }
}; 