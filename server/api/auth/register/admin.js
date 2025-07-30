const { dbConnect, isConnected } = require('../../../utils/dbConnect');
const Auth = require('../../../models/Auth');
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

  // Handle GET request - Show API info and data
  if (req.method === 'GET') {
    try {
      // Chỉ connect nếu chưa connected

      if (!isConnected()) {

        await dbConnect();

      }
      const totalAdmins = await Auth.countDocuments({ role: 'admin' });
      const recentAdmins = await Auth.find({ role: 'admin' })
        .select('-password')
        .sort({ createdAt: -1 })
        .limit(10);
      return res.status(200).json({
        message: 'API Đăng ký Tài khoản Admin',
        method: 'POST',
        endpoint: '/api/auth/register/admin',
        requiredFields: ['email', 'phone', 'password', 'fullName', 'address'],
        description: 'Đăng ký tài khoản admin mới',
        databaseStats: {
          totalAdmins,
          recentAdmins: recentAdmins.length
        },
        recentData: {
          admins: recentAdmins.map(admin => ({
            id: admin._id,
            email: admin.email,
            phone: admin.phone,
            fullName: admin.fullName,
            address: admin.address,
            role: admin.role,
            status: admin.status,
            createdAt: admin.createdAt,
            updatedAt: admin.updatedAt
          }))
        },
        example: {
          email: 'admin@example.com',
          phone: '0999999999',
          password: 'admin1234',
          fullName: 'Admin Example',
          address: 'Hà Nội, Việt Nam'
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

  // Chỉ connect nếu chưa connected


  if (!isConnected()) {


    await dbConnect();


  }

  try {
    const { email, phone, password, fullName, address } = req.body;

    // Validation
    if (!email || !phone || !password || !fullName || !address) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin bắt buộc: email, phone, password, fullName, address'
      });
    }

    // Validate email format
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false,
        message: 'Email không hợp lệ'
      });
    }

    // Validate phone format (Vietnamese phone)
    const phoneRegex = /^[0-9]{9,11}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ 
        success: false,
        message: 'Số điện thoại không hợp lệ (9-11 số)'
      });
    }

    // Validate password
    if (password.length < 6) {
      return res.status(400).json({ 
        success: false,
        message: 'Mật khẩu phải có ít nhất 6 ký tự'
      });
    }

    // Check if email already exists
    const existingEmail = await Auth.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: 'Email đã tồn tại'
      });
    }

    // Check if phone already exists
    const existingPhone = await Auth.findOne({ phone });
    if (existingPhone) {
      return res.status(400).json({
        success: false,
        message: 'Số điện thoại đã tồn tại'
      });
    }

    // Create admin account (password sẽ được mã hóa tự động bởi middleware pre-save)
    const adminUser = new Auth({
      role: 'admin',
      email: email.toLowerCase(),
      phone,
      password, // Không mã hóa ở đây, để middleware xử lý
      fullName,
      address,
      status: 'active',
      isVerified: true,
      loginAttempts: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await adminUser.save();

    // Return success response (without password)
    const userResponse = adminUser.toObject();
    delete userResponse.password;

    return res.status(201).json({ 
      success: true,
      message: 'Đăng ký tài khoản admin thành công',
      data: {
        user: userResponse
      }
    });

  } catch (error) {
    console.error('Admin Registration Error:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Lỗi server',
      error: error.message 
    });
  }
}; 