const { dbConnect, isConnected } = require('../../utils/dbConnect');
const Auth = require('../../models/Auth');
const Candidates = require('../../models/Candidates');
const Employers = require('../../models/Employers');
const jwt = require('jsonwebtoken');

module.exports = async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
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
      const totalUsers = await Auth.countDocuments();
      const totalAdmins = await Auth.countDocuments({ role: 'admin' });
      const totalCandidates = await Auth.countDocuments({ role: 'candidate' });
      const totalEmployers = await Auth.countDocuments({ role: 'employer' });
      
      // Lấy dữ liệu thực tế từ database
      const recentUsers = await Auth.find()
        .select('-password')
        .sort({ createdAt: -1 })
        .limit(5);
      
      const recentCandidates = await Candidates.find()
        .sort({ createdAt: -1 })
        .limit(5);
      
      const recentEmployers = await Employers.find()
        .sort({ createdAt: -1 })
        .limit(5);
      
      return res.status(200).json({
        message: 'API Đăng nhập',
        method: 'POST',
        endpoint: '/api/auth/login',
        requiredFields: ['email', 'password'],
        description: 'Đăng nhập với email và password, hỗ trợ đa role',
        supportedRoles: ['admin', 'candidate', 'employer'],
        databaseStats: {
          totalUsers,
          totalAdmins,
          totalCandidates,
          totalEmployers
        },
        recentData: {
          recentUsers: recentUsers.map(user => ({
            id: user._id,
            email: user.email,
            phone: user.phone,
            fullName: user.fullName,
            companyName: user.companyName,
            role: user.role,
            status: user.status,
            createdAt: user.createdAt
          })),
          recentCandidates: recentCandidates.map(cand => ({
            id: cand._id,
            userId: cand.userId,
            fullName: cand.fullName,
            phoneNumber: cand.phoneNumber,
            city: cand.city,
            gender: cand.gender,
            isAvailable: cand.isAvailable,
            createdAt: cand.createdAt
          })),
          recentEmployers: recentEmployers.map(emp => ({
            id: emp._id,
            userId: emp.userId,
            companyName: emp.companyName,
            companyEmail: emp.companyEmail,
            industry: emp.industry,
            companySize: emp.companySize,
            createdAt: emp.createdAt
          }))
        },
        example: {
          email: 'user@example.com',
          password: 'password123'
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
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email và password là bắt buộc'
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

    // Find user by email (include password for comparison)
    const user = await Auth.findOne({ email: email.toLowerCase() }).select('+password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email hoặc password không đúng'
      });
    }

    // Check if account is active
    if (user.status !== 'active') {
      return res.status(401).json({
        success: false,
        message: 'Tài khoản đã bị khóa'
      });
    }

    // Check if account is locked
    if (user.lockUntil && user.lockUntil > Date.now()) {
      return res.status(401).json({
        success: false,
        message: 'Tài khoản đã bị khóa tạm thời'
      });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      // Increment login attempts
      user.loginAttempts += 1;
      
      // Lock account after 5 failed attempts
      if (user.loginAttempts >= 5) {
        user.lockUntil = new Date(Date.now() + 15 * 60 * 1000); // Lock for 15 minutes
      }
      
      await user.save();
      
      return res.status(401).json({
        success: false,
        message: 'Email hoặc password không đúng'
      });
    }

    // Reset login attempts on successful login
    user.loginAttempts = 0;
    user.lockUntil = null;
    user.lastLogin = new Date();
    await user.save();

    // Get additional profile data based on role
    let profileData = null;
    
    try {
      if (user.role === 'candidate') {
        const candidateProfile = await Candidates.findOne({ userId: user._id });
        if (candidateProfile) {
          profileData = {
            id: candidateProfile._id,
            fullName: candidateProfile.fullName,
            phoneNumber: candidateProfile.phoneNumber,
            city: candidateProfile.city,
            district: candidateProfile.district,
            ward: candidateProfile.ward,
            specificAddress: candidateProfile.specificAddress,
            dateOfBirth: candidateProfile.dateOfBirth,
            gender: candidateProfile.gender,
            bio: candidateProfile.bio,
            skills: candidateProfile.skills,
            expectedSalary: candidateProfile.expectedSalary,
            preferredJobTypes: candidateProfile.preferredJobTypes,
            preferredLocations: candidateProfile.preferredLocations,
            isAvailable: candidateProfile.isAvailable,
            isPublic: candidateProfile.isPublic,
            avatarUrl: candidateProfile.avatarUrl
          };
        }
      } else if (user.role === 'employer') {
        const employerProfile = await Employers.findOne({ userId: user._id });
        if (employerProfile) {
          profileData = {
            id: employerProfile._id,
            companyName: employerProfile.companyName,
            companyEmail: employerProfile.companyEmail,
            companyPhoneNumber: employerProfile.companyPhoneNumber,
            companyAddress: employerProfile.companyAddress,
            companyWebsite: employerProfile.companyWebsite,
            companyDescription: employerProfile.companyDescription,
            industry: employerProfile.industry,
            companySize: employerProfile.companySize,
            foundedYear: employerProfile.foundedYear,
            companyLogoUrl: employerProfile.companyLogoUrl
          };
        }
      }
    } catch (profileError) {
      console.error('Error fetching profile data:', profileError);
      // Continue without profile data if there's an error
    }

    // Create user response (without password)
    const userResponse = user.toObject();
    delete userResponse.password;

    // Merge profile data into user response
    if (profileData) {
      Object.assign(userResponse, profileData);
    }

    // Tạo JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '7d' }
    );

    // Log response for debugging
    console.log('Login response:', {
      success: true,
      message: 'Đăng nhập thành công',
      user: userResponse
    });

    return res.status(200).json({
      success: true,
      message: 'Đăng nhập thành công',
      token,
      user: userResponse
    });

  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
}; 