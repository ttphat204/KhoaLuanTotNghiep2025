const dbConnect = require('../../../utils/dbConnect');
const Auth = require('../../../models/Auth');
const Candidates = require('../../../models/Candidates');
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
      const totalCandidates = await Auth.countDocuments({ role: 'candidate' });
      
      // Lấy dữ liệu thực tế từ database
      const candidates = await Auth.find({ role: 'candidate' })
        .select('-password') // Không trả về password
        .sort({ createdAt: -1 })
        .limit(10); // Giới hạn 10 records gần nhất
      
      // Lấy thông tin chi tiết từ Candidates collection
      const candidateProfiles = await Candidates.find()
        .sort({ createdAt: -1 })
        .limit(10);
      
      return res.status(200).json({
        message: 'API Đăng ký Tài khoản Ứng viên',
        method: 'POST',
        endpoint: '/api/auth/register/candidate',
        requiredFields: ['email', 'phone', 'password', 'fullName', 'city', 'district', 'ward', 'gender', 'dateOfBirth'],
        description: 'Đăng ký tài khoản mới cho ứng viên tìm việc',
        databaseStats: {
          totalCandidates,
          recentCandidates: candidates.length
        },
        recentData: {
          authUsers: candidates.map(cand => ({
            id: cand._id,
            email: cand.email,
            phone: cand.phone,
            fullName: cand.fullName,
            address: cand.address,
            gender: cand.gender,
            dateOfBirth: cand.dateOfBirth,
            role: cand.role,
            status: cand.status,
            createdAt: cand.createdAt,
            updatedAt: cand.updatedAt
          })),
          candidateProfiles: candidateProfiles.map(profile => ({
            id: profile._id,
            userId: profile.userId,
            fullName: profile.fullName,
            phoneNumber: profile.phoneNumber,
            city: profile.city,
            district: profile.district,
            ward: profile.ward,
            specificAddress: profile.specificAddress,
            dateOfBirth: profile.dateOfBirth,
            gender: profile.gender,
            bio: profile.bio,
            skills: profile.skills,
            expectedSalary: profile.expectedSalary,
            preferredJobTypes: profile.preferredJobTypes,
            preferredLocations: profile.preferredLocations,
            isAvailable: profile.isAvailable,
            isPublic: profile.isPublic,
            createdAt: profile.createdAt,
            updatedAt: profile.updatedAt
          }))
        },
        example: {
          email: 'candidate@example.com',
          phone: '0987654321',
          password: 'password123',
          fullName: 'Nguyễn Văn A',
          city: 'TP.HCM',
          district: 'Quận 1',
          ward: 'Phường Bến Nghé',
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
      fullName, 
      city,
      district,
      ward,
      gender,
      dateOfBirth 
    } = req.body;

    // Validation - chỉ yêu cầu email, phone, password
    if (!email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin bắt buộc: email, phone, password',
        received: { email: !!email, phone: !!phone, password: !!password }
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

    // Validate phone format (Vietnamese phone) - bớt strict
    const phoneRegex = /^[0-9]{9,11}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ 
        success: false,
        message: 'Số điện thoại không hợp lệ (9-11 số)'
      });
    }

    // Validate password - bớt strict
    if (password.length < 6) {
      return res.status(400).json({ 
        success: false,
        message: 'Mật khẩu phải có ít nhất 6 ký tự'
      });
    }

    // Validate gender nếu có
    if (gender && !['Male', 'Female', 'Other'].includes(gender)) {
      return res.status(400).json({ 
        success: false,
        message: 'Giới tính không hợp lệ (Male, Female, Other)'
      });
    }

    // Validate date of birth nếu có
    let birthDate = null;
    if (dateOfBirth) {
      birthDate = new Date(dateOfBirth);
      if (isNaN(birthDate.getTime())) {
        return res.status(400).json({ 
          success: false,
          message: 'Ngày sinh không hợp lệ'
        });
      }
      
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    if (age < 16 || age > 100) {
      return res.status(400).json({ 
          success: false,
          message: 'Tuổi phải từ 16 đến 100'
      });
      }
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
      role: 'candidate',
      email: email.toLowerCase(),
      phone,
      password,
      fullName: fullName || 'Chưa cập nhật',
      address: `${city || ''}, ${district || ''}, ${ward || ''}`.replace(/^,\s*/, '').replace(/,\s*$/, '') || 'Chưa cập nhật',
      gender: gender || 'Other',
      dateOfBirth: birthDate || new Date('1990-01-01')
    });

    await authUser.save();

    // Create candidate profile
    const candidateProfile = new Candidates({
      userId: authUser._id,
      fullName: fullName || 'Chưa cập nhật',
      phoneNumber: phone,
      city: city || 'Chưa cập nhật',
      district: district || '',
      ward: ward || '',
      specificAddress: `${city || ''}, ${district || ''}, ${ward || ''}`.replace(/^,\s*/, '').replace(/,\s*$/, '') || 'Chưa cập nhật',
      dateOfBirth: birthDate || new Date('1990-01-01'),
      gender: gender || 'Other'
    });

    await candidateProfile.save();

    // Return success response (without password)
    const userResponse = authUser.toObject();
    delete userResponse.password;

    return res.status(201).json({ 
      success: true,
      message: 'Đăng ký tài khoản thành công',
      data: {
      user: userResponse,
        candidateProfile: {
          id: candidateProfile._id,
          fullName: candidateProfile.fullName
        }
      }
    });

  } catch (error) {
    console.error('Candidate Registration Error:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Lỗi server',
      error: error.message 
    });
  }
}; 