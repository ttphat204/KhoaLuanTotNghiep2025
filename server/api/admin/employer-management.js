const dbConnect = require('../../utils/dbConnect');
const Auth = require('../../models/Auth');
const Employers = require('../../models/Employers');
const Jobs = require('../../models/Jobs');
const Applications = require('../../models/Applications');
const Interviews = require('../../models/Interviews');
const Notifications = require('../../models/Notifications');
const EmployerRegistration = require('../../models/EmployerRegistration');

async function handler(req, res) {
  // Thêm header CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Xử lý preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  await dbConnect();

  // API GET: Lấy danh sách employer
  if (req.method === 'GET') {
    try {
      const { employerId, registrationId } = req.query;
      
      // Nếu có registrationId, lấy chi tiết một đăng ký
      if (registrationId) {
        const registration = await EmployerRegistration.findById(registrationId);
        if (!registration) {
          return res.status(404).json({ message: 'Không tìm thấy đăng ký' });
        }
        return res.json({
          id: registration._id,
          email: registration.email,
          phone: registration.phone,
          companyName: registration.companyName,
          companyAddress: registration.companyAddress,
          city: registration.city,
          district: registration.district,
          ward: registration.ward,
          companyWebsite: registration.companyWebsite,
          companyDescription: registration.companyDescription,
          industry: registration.industry,
          companySize: registration.companySize,
          foundedYear: registration.foundedYear,
          status: registration.status,
          createdAt: registration.createdAt
        });
      }

      // Nếu có employerId, lấy chi tiết một employer
      if (employerId) {
        const authUser = await Auth.findById(employerId).select('-password');
        if (!authUser || authUser.role !== 'employer') {
          return res.status(404).json({ message: 'Không tìm thấy employer' });
        }
        
        const employerProfile = await Employers.findOne({ userId: authUser._id });
        return res.json({
          id: authUser._id,
          email: authUser.email,
          phone: authUser.phone,
          companyName: authUser.companyName,
          address: authUser.address,
          status: authUser.status,
          createdAt: authUser.createdAt,
          profile: employerProfile ? {
            companyAddress: employerProfile.companyAddress,
            city: employerProfile.city,
            district: employerProfile.district,
            ward: employerProfile.ward,
            industry: employerProfile.industry,
            companyWebsite: employerProfile.companyWebsite,
            companyDescription: employerProfile.companyDescription,
            companySize: employerProfile.companySize,
            foundedYear: employerProfile.foundedYear
          } : null
        });
      }

      // Lấy danh sách tất cả employer
      const allEmployers = await Auth.find({ 
        role: 'employer'
      }).select('-password').sort({ createdAt: -1 });

      // Lấy thông tin chi tiết từ bảng Employers
      const employerDetails = await Promise.all(
        allEmployers.map(async (auth) => {
          const profile = await Employers.findOne({ userId: auth._id });
          return {
            id: auth._id,
            email: auth.email,
            phone: auth.phone,
            companyName: auth.companyName,
            address: auth.address,
            status: auth.status,
            createdAt: auth.createdAt,
            profile: profile ? {
              companyAddress: profile.companyAddress,
              city: profile.city,
              district: profile.district,
              ward: profile.ward,
              industry: profile.industry,
              companyWebsite: profile.companyWebsite,
              companyDescription: profile.companyDescription,
              companySize: profile.companySize,
              foundedYear: profile.foundedYear
            } : null
          };
        })
      );

      return res.json(employerDetails);
    } catch (error) {
      return res.status(500).json({ 
        message: 'Lỗi khi lấy danh sách employer', 
        error: error.message 
      });
    }
  }

  // API POST: Duyệt/Từ chối employer
  if (req.method === 'POST') {
    try {
      const { employerId, action, rejectReason } = req.body;
      
      if (!employerId || !['approve', 'reject'].includes(action)) {
        return res.status(400).json({ message: 'Thiếu thông tin hoặc action không hợp lệ' });
      }

      // Tìm Auth và Employers theo id
      const authUser = await Auth.findById(employerId);
      if (!authUser) {
        return res.status(404).json({ message: 'Không tìm thấy tài khoản employer' });
      }
      const employerProfile = await Employers.findOne({ userId: authUser._id });
      if (!employerProfile) {
        return res.status(404).json({ message: 'Không tìm thấy profile employer' });
      }

      if (authUser.status !== 'inactive') {
        return res.status(400).json({ message: 'Tài khoản đã được xử lý' });
      }

      if (action === 'reject') {
        authUser.status = 'rejected';
        employerProfile.status = 'rejected';
        if (rejectReason) employerProfile.rejectReason = rejectReason;
        await authUser.save();
        await employerProfile.save();
        return res.json({ success: true, message: 'Đã từ chối đăng ký', status: 'rejected' });
      }

      // action === 'approve'
      authUser.status = 'active';
      employerProfile.status = 'active';
      await authUser.save();
      await employerProfile.save();

      return res.json({ success: true, message: 'Đã duyệt đăng ký', status: 'approved' });
    } catch (error) {
      console.error('Lỗi khi xử lý employer:', error);
      return res.status(500).json({ 
        message: 'Lỗi khi xử lý employer', 
        error: error.message 
      });
    }
  }

  // API DELETE: Xóa employer
  if (req.method === 'DELETE') {
    try {
      const { employerId } = req.body;
      
      if (!employerId) {
        return res.status(400).json({ message: 'Thiếu employerId' });
      }

      // Tìm Auth user
      const authUser = await Auth.findById(employerId);
      if (!authUser) {
        return res.status(404).json({ message: 'Không tìm thấy tài khoản employer' });
      }

      if (authUser.role !== 'employer') {
        return res.status(400).json({ message: 'ID không phải là employer' });
      }

      // Bắt đầu transaction để đảm bảo tính toàn vẹn dữ liệu
      const session = await Auth.startSession();
      session.startTransaction();

      try {
        // 1. Xóa tất cả jobs của employer này
        await Jobs.deleteMany({ employerId: authUser._id }, { session });

        // 2. Xóa tất cả applications liên quan đến jobs của employer này
        const jobIds = await Jobs.find({ employerId: authUser._id }).distinct('_id');
        if (jobIds.length > 0) {
          await Applications.deleteMany({ jobId: { $in: jobIds } }, { session });
        }

        // 3. Xóa tất cả interviews liên quan đến jobs của employer này
        if (jobIds.length > 0) {
          await Interviews.deleteMany({ jobId: { $in: jobIds } }, { session });
        }

        // 4. Xóa tất cả notifications liên quan đến employer này
        await Notifications.deleteMany({ 
          $or: [
            { recipientId: authUser._id },
            { senderId: authUser._id }
          ]
        }, { session });

        // 5. Xóa profile employer
        await Employers.deleteOne({ userId: authUser._id }, { session });

        // 6. Cuối cùng xóa Auth user
        await Auth.deleteOne({ _id: authUser._id }, { session });

        // Commit transaction
        await session.commitTransaction();

        return res.json({ 
          success: true, 
          message: 'Đã xóa employer và tất cả dữ liệu liên quan thành công',
          deletedEmployer: {
            id: authUser._id,
            email: authUser.email,
            companyName: authUser.companyName
          }
        });

      } catch (error) {
        // Rollback nếu có lỗi
        await session.abortTransaction();
        throw error;
      } finally {
        session.endSession();
      }

    } catch (error) {
      console.error('Lỗi khi xóa employer:', error);
      return res.status(500).json({ 
        message: 'Lỗi khi xóa employer', 
        error: error.message 
      });
    }
  }

  return res.status(405).json({ message: 'Method Not Allowed' });
}

module.exports = handler; 