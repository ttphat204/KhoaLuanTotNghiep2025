const dbConnect = require('../../utils/dbConnect');
const Employers = require('../../models/Employers');
const mongoose = require('mongoose');

module.exports = async function handler(req, res) {
  // Thêm CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Xử lý preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  await dbConnect();

  if (req.method === 'GET') {
    const { employerId } = req.query;
    console.log('[GET /api/employer/profile] employerId:', employerId);
    if (!employerId) return res.status(400).json({ success: false, message: 'Thiếu employerId' });
    try {
      const profile = await Employers.findById(new mongoose.Types.ObjectId(employerId));
      console.log('[GET /api/employer/profile] profile:', profile);
      if (!profile) return res.status(404).json({ success: false, message: 'Không tìm thấy employer' });
      return res.json({ success: true, data: profile });
    } catch (err) {
      console.error('[GET /api/employer/profile] Error:', err);
      return res.status(500).json({ success: false, message: 'Lỗi server', error: err.message });
    }
  }

  if (req.method === 'PUT') {
    const { employerId, ...updateData } = req.body;
    console.log('[PUT /api/employer/profile] employerId:', employerId, 'updateData:', updateData);
    if (!employerId) return res.status(400).json({ success: false, message: 'Thiếu employerId' });
    try {
      const profile = await Employers.findByIdAndUpdate(new mongoose.Types.ObjectId(employerId), updateData, { new: true });
      console.log('[PUT /api/employer/profile] profile:', profile);
      if (!profile) return res.status(404).json({ success: false, message: 'Không tìm thấy employer' });
      return res.json({ success: true, data: profile });
    } catch (err) {
      console.error('[PUT /api/employer/profile] Error:', err);
      return res.status(500).json({ success: false, message: 'Lỗi server', error: err.message });
    }
  }

  return res.status(405).json({ success: false, message: 'Method Not Allowed' });
}; 