const dbConnect = require('../../utils/dbConnect');
const Auth = require('../../models/Auth');
const Candidates = require('../../models/Candidates');

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

  // Handle GET request - Show API info
  if (req.method === 'GET') {
    try {
      const totalCandidates = await Auth.countDocuments({ role: 'candidate' });
        
        return res.status(200).json({
        message: 'API Cập nhật Thông tin Cá nhân Ứng viên',
        method: 'PUT',
        endpoint: '/api/user/personal-info',
          requiredFields: ['userId'],
        optionalFields: ['email', 'phone', 'gender', 'dateOfBirth'],
        description: 'Cập nhật thông tin cá nhân cơ bản cho ứng viên',
          databaseStats: {
          totalCandidates
          },
          example: {
              userId: '65a1b2c3d4e5f6789012345',
          email: 'newemail@example.com',
          phone: '0987654321',
          gender: 'Male',
          dateOfBirth: '1990-01-01'
        }
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Lỗi khi lấy dữ liệu',
        error: error.message
      });
    }
  }

  // Handle PUT request
  if (req.method !== 'PUT') {
    return res.status(405).json({ 
      message: 'Method Not Allowed',
      allowedMethods: ['GET', 'PUT'],
      receivedMethod: req.method 
    });
  }

  try {
    const { userId, email, phone, gender, dateOfBirth } = req.body;
    
    // Validation
    if (!userId) {
      return res.status(400).json({ 
        success: false,
        message: 'Thiếu userId'
      });
    }

    // Find user
    const user = await Auth.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'Không tìm thấy người dùng'
      });
    }

    // Check if user is a candidate
    if (user.role !== 'candidate') {
      return res.status(403).json({
        success: false,
        message: 'Chỉ ứng viên mới có thể cập nhật thông tin cá nhân'
      });
    }

    // Validate email if provided
    if (email) {
      const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: 'Email không hợp lệ'
        });
      }

      // Check if email already exists (excluding current user)
      const existingEmail = await Auth.findOne({ 
        email: email.toLowerCase(), 
        _id: { $ne: userId } 
      });
      if (existingEmail) {
        return res.status(400).json({
          success: false,
          message: 'Email đã tồn tại'
      });
      }
    }

    // Validate phone if provided
    if (phone) {
      const phoneRegex = /^[0-9]{10,11}$/;
      if (!phoneRegex.test(phone)) {
        return res.status(400).json({
          success: false,
          message: 'Số điện thoại không hợp lệ'
        });
      }

      // Check if phone already exists (excluding current user)
      const existingPhone = await Auth.findOne({ 
        phone, 
        _id: { $ne: userId } 
      });
      if (existingPhone) {
        return res.status(400).json({
          success: false,
          message: 'Số điện thoại đã tồn tại'
        });
      }
    }

    // Validate gender if provided
    if (gender && !['Male', 'Female', 'Other'].includes(gender)) {
      return res.status(400).json({
        success: false,
        message: 'Giới tính không hợp lệ'
      });
    }

    // Validate date of birth if provided
    if (dateOfBirth) {
      const birthDate = new Date(dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 16 || age > 100) {
        return res.status(400).json({ 
          success: false,
          message: 'Tuổi phải từ 16 đến 100'
        });
      }
    }

    // Update Auth user
    const updateData = {};
    if (email) updateData.email = email.toLowerCase();
    if (phone) updateData.phone = phone;
    if (gender) updateData.gender = gender;
    if (dateOfBirth) updateData.dateOfBirth = new Date(dateOfBirth);

    Object.assign(user, updateData);
    await user.save();

    // Update Candidate profile
    const candidateProfile = await Candidates.findOne({ userId });
    if (candidateProfile) {
      const candidateUpdateData = {};
      if (phone) candidateUpdateData.phoneNumber = phone;
      if (gender) candidateUpdateData.gender = gender;
      if (dateOfBirth) candidateUpdateData.dateOfBirth = new Date(dateOfBirth);

      Object.assign(candidateProfile, candidateUpdateData);
      await candidateProfile.save();
    }

    // Return updated user data (without password)
    const userResponse = user.toObject();
    delete userResponse.password;

    return res.status(200).json({ 
      success: true,
      message: 'Cập nhật thông tin cá nhân thành công', 
      data: {
        user: userResponse,
        candidateProfile: candidateProfile ? {
          id: candidateProfile._id,
          fullName: candidateProfile.fullName,
          phoneNumber: candidateProfile.phoneNumber,
          gender: candidateProfile.gender,
          dateOfBirth: candidateProfile.dateOfBirth
        } : null
      }
    });

  } catch (error) {
    console.error('Personal Info Update Error:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Lỗi server',
      error: error.message 
    });
  }
}; 