const dbConnect = require('../../utils/dbConnect');
const Auth = require('../../models/Auth');
const crypto = require('crypto');

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
        message: 'API Kiểm tra Token Reset Password',
        method: 'POST',
        endpoint: '/api/auth/verify-reset-token',
        requiredFields: ['token'],
        description: 'Kiểm tra token reset password có hợp lệ không',
        example: {
          token: 'abc123...'
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
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ 
        message: 'Vui lòng nhập token' 
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
        message: 'Token không hợp lệ hoặc đã hết hạn',
        valid: false
      });
    }

    return res.status(200).json({
      message: 'Token hợp lệ',
      valid: true,
      email: user.email,
      expiresAt: user.resetPasswordExpires
    });

  } catch (error) {
    console.error('Lỗi kiểm tra token:', error);
    return res.status(500).json({ 
      message: 'Lỗi khi kiểm tra token', 
      error: error.message 
    });
  }
}; 