const dbConnect = require('../../utils/dbConnect');
const Auth = require('../../models/Auth');
const Employers = require('../../models/Employers');

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
      const totalEmployers = await Auth.countDocuments({ role: 'employer' });
      
      return res.status(200).json({
        message: 'API Cập nhật Thông tin Công ty',
        method: 'PUT',
        endpoint: '/api/user/company-info',
        requiredFields: ['userId'],
        optionalFields: [
          'companyName', 
          'industry', 
          'companySize', 
          'address', 
          'companyWebsite', 
          'companyDescription', 
          'foundedYear'
        ],
        description: 'Cập nhật thông tin công ty cho nhà tuyển dụng',
        databaseStats: {
          totalEmployers
        },
        example: {
          userId: '65a1b2c3d4e5f6789012345',
          companyName: 'Công ty ABC mới',
          industry: 'Công nghệ thông tin',
          companySize: 150,
          address: 'TP.HCM, Quận 1',
          companyWebsite: 'https://newcompany.com',
          companyDescription: 'Công ty chuyên về phát triển phần mềm và AI',
          foundedYear: 2021
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

  await dbConnect();
  
  try {
    const { 
      userId, 
      companyName, 
      industry, 
      companySize, 
      address, 
      companyWebsite, 
      companyDescription, 
      foundedYear 
    } = req.body;

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

    // Check if user is an employer
    if (user.role !== 'employer') {
      return res.status(403).json({
        success: false,
        message: 'Chỉ nhà tuyển dụng mới có thể cập nhật thông tin công ty'
      });
    }

    // Validate company size if provided
    if (companySize && companySize < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quy mô công ty phải lớn hơn 0'
      });
    }

    // Validate founded year if provided
    if (foundedYear && (foundedYear < 1900 || foundedYear > new Date().getFullYear())) {
      return res.status(400).json({
        success: false,
        message: 'Năm thành lập không hợp lệ'
      });
    }

    // Validate website URL if provided
    if (companyWebsite) {
      try {
        new URL(companyWebsite);
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: 'Website không hợp lệ'
        });
      }
    }

    // Update Auth user
    const authUpdateData = {};
    if (companyName) authUpdateData.companyName = companyName;
    if (address) authUpdateData.address = address;

    Object.assign(user, authUpdateData);
    await user.save();

    // Update Employer profile
    const employerProfile = await Employers.findOne({ userId });
    if (employerProfile) {
      const employerUpdateData = {};
      if (companyName) employerUpdateData.companyName = companyName;
      if (industry) employerUpdateData.industry = industry;
      if (companySize) employerUpdateData.companySize = companySize;
      if (address) employerUpdateData.companyAddress = address;
      if (companyWebsite) employerUpdateData.companyWebsite = companyWebsite;
      if (companyDescription) employerUpdateData.companyDescription = companyDescription;
      if (foundedYear) employerUpdateData.foundedYear = foundedYear;

      Object.assign(employerProfile, employerUpdateData);
      await employerProfile.save();
    }

    // Return updated user data (without password)
    const userResponse = user.toObject();
    delete userResponse.password;

    return res.status(200).json({
      success: true,
      message: 'Cập nhật thông tin công ty thành công',
      data: {
        user: userResponse,
        employerProfile: employerProfile ? {
          id: employerProfile._id,
          companyName: employerProfile.companyName,
          companyEmail: employerProfile.companyEmail,
          companyPhoneNumber: employerProfile.companyPhoneNumber,
          companyAddress: employerProfile.companyAddress,
          companyWebsite: employerProfile.companyWebsite,
          companyDescription: employerProfile.companyDescription,
          industry: employerProfile.industry,
          companySize: employerProfile.companySize,
          foundedYear: employerProfile.foundedYear
        } : null
      }
    });

  } catch (error) {
    console.error('Company Info Update Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
}; 