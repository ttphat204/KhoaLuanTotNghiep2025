const dbConnect = require('../../utils/dbConnect');
const Auth = require('../../models/Auth');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

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
      
      return res.status(200).json({
        message: 'API Reset Mật khẩu',
        method: 'POST',
        endpoint: '/api/auth/reset-password',
        requiredFields: ['token', 'newPassword'],
        description: 'Reset mật khẩu với token từ email',
        example: {
          token: 'abc123...',
          newPassword: 'newpassword123'
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
    const { token, newPassword } = req.body;
    
    if (!token || !newPassword) {
      return res.status(400).json({ 
        message: 'Vui lòng nhập đầy đủ token và mật khẩu mới' 
      });
    }

    // Validate password
    if (newPassword.length < 8) {
      return res.status(400).json({ 
        message: 'Mật khẩu phải có ít nhất 8 ký tự' 
      });
    }

    // Hash token để so sánh
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Tìm user với token hợp lệ và chưa hết hạn
    const user = await Auth.findOne({
      resetPasswordToken: resetPasswordToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ 
        message: 'Token không hợp lệ hoặc đã hết hạn. Vui lòng yêu cầu reset password mới.' 
      });
    }

    // Cập nhật mật khẩu và xóa token (password sẽ được mã hóa tự động bởi middleware pre-save)
    user.password = newPassword; // Không mã hóa ở đây, để middleware xử lý
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return res.status(200).json({
      message: 'Đặt lại mật khẩu thành công. Bạn có thể đăng nhập với mật khẩu mới.',
      email: user.email
    });

  } catch (error) {
    console.error('Lỗi reset password:', error);
    return res.status(500).json({ 
      message: 'Lỗi khi đặt lại mật khẩu', 
      error: error.message 
    });
  }
}; 