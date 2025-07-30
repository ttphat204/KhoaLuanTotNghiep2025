const { dbConnect, isConnected } = require('../../utils/dbConnect');
const Employers = require('../../models/Employers');
const mongoose = require('mongoose');

module.exports = async function handler(req, res) {
  // Thêm CORS headers đầy đủ
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Xử lý preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Chỉ connect nếu chưa connected


  if (!isConnected()) {


    await dbConnect();


  }

  // Helper function để tìm profile
  const findProfile = async (employerId) => {
    if (!employerId || !mongoose.Types.ObjectId.isValid(employerId)) {
      return null;
    }
    
    try {
      // Tìm kiếm theo _id trước (nếu employerId là Employers._id)
      let profile = await Employers.findById(new mongoose.Types.ObjectId(employerId));
      
      // Nếu không tìm thấy, tìm kiếm theo userId (nếu employerId là Auth._id)
      if (!profile) {
        profile = await Employers.findOne({ userId: new mongoose.Types.ObjectId(employerId) });
      }
      
      return profile;
    } catch (err) {
      console.error('[findProfile] Error:', err);
      return null;
    }
  };

  if (req.method === 'GET') {
    const { employerId, list } = req.query;
    
    // Nếu có parameter list, trả về danh sách tất cả employers
    if (list === 'true') {
      try {
        const allEmployers = await Employers.find().limit(10);
        return res.json({ 
          success: true, 
          count: allEmployers.length,
          data: allEmployers 
        });
      } catch (err) {
        console.error('[GET /api/employer/profile] Error listing employers:', err);
        return res.status(500).json({ success: false, message: 'Lỗi server', error: err.message });
      }
    }
    
    console.log('[GET /api/employer/profile] employerId:', employerId);
    if (!employerId) return res.status(400).json({ success: false, message: 'Thiếu employerId' });
    
    const profile = await findProfile(employerId);
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy employer' });
    }
    
    return res.json({ success: true, data: profile });
  }

  if (req.method === 'PUT') {
    const { employerId, ...updateData } = req.body;
    console.log('[PUT /api/employer/profile] employerId:', employerId, 'updateData:', updateData);
    if (!employerId) return res.status(400).json({ success: false, message: 'Thiếu employerId' });
    
    const profile = await findProfile(employerId);
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy employer' });
    }
    
    try {
      // Cập nhật profile
      const updatedProfile = await Employers.findByIdAndUpdate(profile._id, updateData, { new: true });
      console.log('[PUT /api/employer/profile] profile:', updatedProfile);
      return res.json({ success: true, data: updatedProfile });
    } catch (err) {
      console.error('[PUT /api/employer/profile] Error:', err);
      return res.status(500).json({ success: false, message: 'Lỗi server', error: err.message });
    }
  }

  if (req.method === 'POST') {
    const { employerId, createSample } = req.body;
    
    // Tạo dữ liệu mẫu nếu có parameter createSample
    if (createSample === 'true') {
      try {
        const Auth = require('../../models/Auth');
        const authUsers = await Auth.find({ role: 'employer' }).limit(5);
        
        const createdProfiles = [];
        for (const authUser of authUsers) {
          const existingProfile = await findProfile(authUser._id);
          
          if (!existingProfile) {
            const sampleProfile = new Employers({
              _id: authUser._id,
              userId: authUser._id,
              companyName: authUser.companyName || `Công ty ${authUser.email.split('@')[0]}`,
              companyEmail: authUser.email,
              companyPhoneNumber: authUser.phone,
              companyAddress: authUser.address || '123 Đường ABC, Quận 1, TP.HCM',
              industry: 'Công nghệ thông tin',
              companySize: '10-50 nhân viên',
              companyDescription: 'Công ty chuyên về phát triển phần mềm và giải pháp công nghệ hiện đại',
              companyWebsite: 'https://example.com',
              foundedYear: '2020',
              status: 'active'
            });
            
            await sampleProfile.save();
            createdProfiles.push(sampleProfile);
          }
        }
        
        return res.json({ 
          success: true, 
          message: `Đã tạo ${createdProfiles.length} profile mẫu`,
          data: createdProfiles 
        });
      } catch (err) {
        console.error('[POST /api/employer/profile] Error creating sample data:', err);
        return res.status(500).json({ success: false, message: 'Lỗi server', error: err.message });
      }
    }
    
    console.log('[POST /api/employer/profile] employerId:', employerId);
    if (!employerId) return res.status(400).json({ success: false, message: 'Thiếu employerId' });
    
    const profile = await findProfile(employerId);
    if (profile) {
      return res.json({ success: true, data: profile, message: 'Profile đã tồn tại' });
    }
    
    try {
      // Tạo profile mẫu nếu chưa có
      const Auth = require('../../models/Auth');
      const authUser = await Auth.findById(new mongoose.Types.ObjectId(employerId));
      if (!authUser || authUser.role !== 'employer') {
        return res.status(404).json({ success: false, message: 'Không tìm thấy employer' });
      }
      
      const newProfile = new Employers({
        _id: authUser._id,
        userId: authUser._id,
        companyName: authUser.companyName || 'Công ty mẫu',
        companyEmail: authUser.email,
        companyPhoneNumber: authUser.phone,
        companyAddress: authUser.address || 'Chưa cập nhật',
        industry: 'Công nghệ thông tin',
        companySize: '10-50 nhân viên',
        companyDescription: 'Công ty chuyên về phát triển phần mềm và giải pháp công nghệ',
        companyWebsite: 'https://example.com',
        foundedYear: '2020',
        status: 'active'
      });
      
      await newProfile.save();
      console.log('[POST /api/employer/profile] created profile:', newProfile);
      return res.json({ success: true, data: newProfile, message: 'Tạo profile thành công' });
    } catch (err) {
      console.error('[POST /api/employer/profile] Error:', err);
      return res.status(500).json({ success: false, message: 'Lỗi server', error: err.message });
    }
  }

  return res.status(405).json({ success: false, message: 'Method Not Allowed' });
}; 