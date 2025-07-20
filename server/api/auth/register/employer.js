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

  await dbConnect();

  // Handle GET request - Show API info and data
  if (req.method === 'GET') {
    try {
      const totalEmployers = await Auth.countDocuments({ role: 'employer' });
      const employers = await Auth.find({ role: 'employer' })
        .select('-password')
        .sort({ createdAt: -1 })
        .limit(10);
      const employerProfiles = await Employers.find()
        .sort({ createdAt: -1 })
        .limit(10);
      return res.status(200).json({
        message: 'API Đăng ký Tài khoản Nhà tuyển dụng',
        method: 'POST',
        endpoint: '/api/auth/register/employer',
        requiredFields: ['email', 'phone', 'password', 'companyName', 'companyAddress', 'city', 'district', 'ward', 'industry', 'companySize'],
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
            city: profile.city,
            district: profile.district,
            ward: profile.ward,
            companyWebsite: profile.companyWebsite,
            companyDescription: profile.companyDescription,
            industry: profile.industry,
            companySize: profile.companySize,
            foundedYear: profile.foundedYear,
            status: profile.status,
            createdAt: profile.createdAt,
            updatedAt: profile.updatedAt
          }))
        },
        example: {
          email: 'employer@company.com',
          phone: '0987654321',
          password: 'password123',
          companyName: 'Công ty ABC',
          companyAddress: '123 Đường ABC, Phường 1, Quận 1, TP.HCM',
          city: 'Thành phố Hồ Chí Minh',
          district: 'Quận 1',
          ward: 'Phường Bến Nghé',
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

  try {
    const { 
      email, 
      phone, 
      password, 
      companyName, 
      companyAddress,
      city,
      district,
      ward,
      industry, 
      companySize,
      companyWebsite,
      companyDescription,
      foundedYear,
      companyLogoUrl
    } = req.body;

    // Validation
    if (!email || !phone || !password || !companyName || !city || !district || !ward || !industry) {
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

    // Check if email or phone already exists in Auth
    const existingAuth = await Auth.findOne({ $or: [ { email: email.toLowerCase() }, { phone } ] });
    if (existingAuth) {
      return res.status(400).json({
        success: false,
        message: 'Email hoặc số điện thoại đã tồn tại'
      });
    }

    let authUser;
    try {
      authUser = await Auth.create({
        role: 'employer',
        email: email.toLowerCase(),
        phone,
        password: password, // Không mã hóa ở đây, để middleware xử lý
        companyName,
        address: `${city || ''}, ${district || ''}, ${ward || ''}`.replace(/^,\s*/, '').replace(/,\s*$/, '') || 'Chưa cập nhật',
        status: 'inactive'
      });
    } catch (err) {
      return res.status(400).json({ success: false, message: 'Tạo tài khoản thất bại', error: err.message });
    }
    console.log('authUser:', authUser);
    console.log('authUser._id:', authUser?._id);
    if (!authUser || !authUser._id) {
      return res.status(500).json({ success: false, message: 'Không tạo được tài khoản employer' });
    }

    const employerProfile = new Employers({
      _id: authUser._id,
      userId: authUser._id, // Thêm userId
      companyName,
      companyEmail: email.toLowerCase(),
      companyPhoneNumber: phone,
      companyAddress: `${city || ''}, ${district || ''}, ${ward || ''}`.replace(/^,\s*/, '').replace(/,\s*$/, '') || 'Chưa cập nhật',
      city: city || '',
      district: district || '',
      ward: ward || '',
      companyWebsite: companyWebsite || '',
      companyDescription: companyDescription || '',
      industry,
      companySize: companySize ? Number(companySize) : undefined,
      foundedYear: foundedYear ? Number(foundedYear) : undefined,
      companyLogoUrl: companyLogoUrl || '',
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    await employerProfile.save();

    return res.status(201).json({
      success: true,
      message: 'Đăng ký thành công, vui lòng chờ admin duyệt!',
      data: {
        id: authUser._id,
        email: authUser.email,
        phone: authUser.phone,
        companyName: authUser.companyName,
        companyAddress: authUser.companyAddress,
        city: authUser.city,
        district: authUser.district,
        ward: authUser.ward,
        status: authUser.status
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