const dbConnect = require('../../../utils/dbConnect');
const Auth = require('../../../models/Auth');
const Employers = require('../../../models/Employers');
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
      await dbConnect();
      const totalEmployers = await Auth.countDocuments({ role: 'employer' });
      
      // Lấy dữ liệu thực tế từ database
      const employers = await Auth.find({ role: 'employer' })
        .select('-password') // Không trả về password
        .sort({ createdAt: -1 })
        .limit(10); // Giới hạn 10 records gần nhất
      
      // Lấy thông tin chi tiết từ Employers collection
      const employerProfiles = await Employers.find()
        .sort({ createdAt: -1 })
        .limit(10);
      
      return res.status(200).json({
        message: 'API Đăng ký Tài khoản Nhà tuyển dụng',
        method: 'POST',
        endpoint: '/api/auth/register/employer',
        requiredFields: ['email', 'phone', 'password', 'companyName', 'address', 'industry', 'companySize'],
        optionalFields: ['companyWebsite', 'companyDescription', 'foundedYear'],
        description: 'Đăng ký tài khoản mới cho nhà tuyển dụng',
        databaseStats: {
          totalEmployers,
          recentEmployers: employers.length
        },
        recentData: {
          authUsers: employers.map(emp => ({
            id: emp._id,
            email: emp.email,
            phone: emp.phone,
            companyName: emp.companyName,
            address: emp.address,
            role: emp.role,
            status: emp.status,
            createdAt: emp.createdAt,
            updatedAt: emp.updatedAt
          })),
          employerProfiles: employerProfiles.map(profile => ({
            id: profile._id,
            userId: profile.userId,
            companyName: profile.companyName,
            companyEmail: profile.companyEmail,
            companyPhoneNumber: profile.companyPhoneNumber,
            companyAddress: profile.companyAddress,
            companyWebsite: profile.companyWebsite,
            companyDescription: profile.companyDescription,
            industry: profile.industry,
            companySize: profile.companySize,
            foundedYear: profile.foundedYear,
            createdAt: profile.createdAt,
            updatedAt: profile.updatedAt
          }))
        },
        example: {
          email: 'employer@company.com',
          phone: '0987654321',
          password: 'password123',
          companyName: 'Công ty ABC',
          address: 'TP.HCM',
          industry: 'Công nghệ thông tin',
          companySize: 100,
          companyWebsite: 'https://company.com',
          companyDescription: 'Công ty chuyên về phát triển phần mềm',
          foundedYear: 2020
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
    const { 
      email, 
      phone, 
      password, 
      companyName, 
      address, 
      industry, 
      companySize,
      companyWebsite,
      companyDescription,
      foundedYear
    } = req.body;

    // Validation
    if (!email || !phone || !password || !companyName || !address || !industry || !companySize) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin bắt buộc'
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
    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        success: false,
        message: 'Số điện thoại không hợp lệ'
      });
    }

    // Validate password
    if (password.length < 8) {
      return res.status(400).json({ 
        success: false,
        message: 'Mật khẩu phải có ít nhất 8 ký tự'
      });
    }

    // Validate company size
    if (companySize < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quy mô công ty phải lớn hơn 0'
      });
    }

    // Validate founded year
    if (foundedYear && (foundedYear < 1900 || foundedYear > new Date().getFullYear())) {
      return res.status(400).json({
        success: false,
        message: 'Năm thành lập không hợp lệ'
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

    // Create auth account
    const authUser = new Auth({
      role: 'employer',
      email: email.toLowerCase(),
      phone,
      password,
      companyName,
      address
    });

    await authUser.save();

    // Create employer profile
    const employerProfile = new Employers({
      userId: authUser._id,
      companyName,
      companyEmail: email.toLowerCase(),
      companyPhoneNumber: phone,
      companyAddress: address,
      companyWebsite: companyWebsite || '',
      companyDescription: companyDescription || '',
      industry,
      companySize,
      foundedYear: foundedYear || null
    });

    await employerProfile.save();

    // Return success response (without password)
    const userResponse = authUser.toObject();
    delete userResponse.password;

    return res.status(201).json({
      success: true,
      message: 'Đăng ký tài khoản thành công',
      data: {
        user: userResponse,
        employerProfile: {
          id: employerProfile._id,
          companyName: employerProfile.companyName
        }
      }
    });
    
  } catch (error) {
    console.error('Employer Registration Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
}; 