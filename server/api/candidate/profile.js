const { dbConnect, isConnected } = require('../../utils/dbConnect');
const Auth = require('../../models/Auth');
const Candidates = require('../../models/Candidates');

module.exports = async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Chỉ connect nếu chưa connected


  if (!isConnected()) {


    await dbConnect();


  }

  // Handle GET request - Lấy thông tin profile
  if (req.method === 'GET') {
    try {
      const { userId } = req.query;
      
      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'Thiếu userId'
        });
      }

      // Tìm thông tin candidate
      let candidate = await Candidates.findOne({ userId });
      
      if (!candidate) {
        // Nếu chưa có profile, tạo mới với thông tin cơ bản từ Auth
        const authUser = await Auth.findById(userId);
        if (!authUser) {
          return res.status(404).json({
            success: false,
            message: 'Không tìm thấy người dùng'
          });
        }

        candidate = new Candidates({
          userId: userId,
          fullName: authUser.fullName || '',
          phoneNumber: authUser.phone || '',
          email: authUser.email || ''
        });
        await candidate.save();
      }

      return res.status(200).json({
        success: true,
        message: 'Lấy thông tin profile thành công',
        data: candidate
      });

    } catch (error) {
      console.error('Get Candidate Profile Error:', error);
      return res.status(500).json({
        success: false,
        message: 'Lỗi server',
        error: error.message
      });
    }
  }

  // Handle PUT request - Cập nhật thông tin profile
  if (req.method === 'PUT') {
    try {
      const { userId, ...updateData } = req.body;
      
      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'Thiếu userId'
        });
      }

      // Kiểm tra người dùng có tồn tại không
      const authUser = await Auth.findById(userId);
      if (!authUser) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy người dùng'
        });
      }

      // Kiểm tra role
      if (authUser.role !== 'candidate') {
        return res.status(403).json({
          success: false,
          message: 'Chỉ ứng viên mới có thể cập nhật thông tin này'
        });
      }

      // Tìm hoặc tạo candidate profile
      let candidate = await Candidates.findOne({ userId });
      
      if (!candidate) {
        candidate = new Candidates({ userId });
      }

      // Cập nhật từng trường nếu có
      const fieldsToUpdate = [
        'fullName', 'email', 'phoneNumber', 'city', 'district', 'ward', 'specificAddress',
        'dateOfBirth', 'gender', 'bio', 'skills', 'experience', 'education',
        'languages', 'certifications', 'socialLinks', 'expectedSalary',
        'preferredJobTypes', 'preferredLocations', 'isAvailable', 'isPublic', 'avatarUrl', 'cvUrl'
      ];

      fieldsToUpdate.forEach(field => {
        if (updateData[field] !== undefined) {
          candidate[field] = updateData[field];
        }
      });

      // Xử lý đặc biệt cho các trường date
      if (updateData.dateOfBirth) {
        candidate.dateOfBirth = new Date(updateData.dateOfBirth);
      }

      await candidate.save();

      return res.status(200).json({
        success: true,
        message: 'Cập nhật thông tin profile thành công',
        data: candidate
      });

    } catch (error) {
      console.error('Update Candidate Profile Error:', error);
      return res.status(500).json({
        success: false,
        message: 'Lỗi server',
        error: error.message
      });
    }
  }

  // Method not allowed
  return res.status(405).json({
    success: false,
    message: 'Method Not Allowed',
    allowedMethods: ['GET', 'PUT']
  });
}; 