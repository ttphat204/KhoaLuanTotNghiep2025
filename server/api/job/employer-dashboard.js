const dbConnect = require('../../utils/dbConnect');
const Jobs = require('../../models/Jobs');
const jwt = require('jsonwebtoken');

module.exports = async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  await dbConnect();

  // Xác thực JWT
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Thiếu token xác thực' });
  }
  const token = authHeader.split(' ')[1];
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Token không hợp lệ' });
  }
  const employerId = decoded.id;

  // Lấy danh sách jobs của employer
  const jobs = await Jobs.find({ employerId });
  // Thống kê
  const totalJobs = jobs.length;
  const activeJobs = jobs.filter(j => j.status === 'Active').length;
  const totalViews = jobs.reduce((sum, j) => sum + (j.viewsCount || 0), 0);
  const totalApplicants = jobs.reduce((sum, j) => sum + (j.applicantsCount || 0), 0);

  res.json({
    success: true,
    data: {
      jobs: { list: jobs },
      stats: {
        totalJobs,
        statusStats: { Active: activeJobs },
        totalViews,
        totalApplicants
      },
      highlights: {}
    }
  });
}; 