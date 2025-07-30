const { dbConnect, isConnected } = require('../../utils/dbConnect');
const Jobs = require('../../models/Jobs');
const Category = require('../../models/Categories');

module.exports = async function handler(req, res) {
  // Thêm CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Xử lý preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  await dbConnect();
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }
  try {
    // Đảm bảo model Auth đã được đăng ký
    const Auth = require('../../models/Auth');
    const { page = 1, limit = 10, status, categoryId } = req.query;
    const skip = (page - 1) * limit;
    let query = {};
    if (status) query.status = status;
    if (categoryId && categoryId !== 'all') query.categoryId = categoryId;
    const jobs = await Jobs.find(query)
      .populate('categoryId', 'name')
      .populate({
        path: 'employerId',
        model: 'Auth',
        select: 'companyName email phone',
      })
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ postedDate: -1 });
    const total = await Jobs.countDocuments(query);

    // Lấy logo từ Employers cho từng job
    const Employers = require('../../models/Employers');
    const jobsWithLogo = await Promise.all(jobs.map(async (job) => {
      let employerLogo = null;
      if (job.employerId && job.employerId._id) {
        const employerProfile = await Employers.findById(job.employerId._id);
        employerLogo = employerProfile?.companyLogoUrl || null;
      }
      return {
        ...job.toObject(),
        employerLogo
      };
    }));

    return res.status(200).json({
      success: true,
      data: jobsWithLogo,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách công việc',
      error: error.message
    });
  }
};
