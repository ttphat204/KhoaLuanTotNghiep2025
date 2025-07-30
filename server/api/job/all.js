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

  // Chỉ connect nếu chưa connected
  if (!isConnected()) {
    await dbConnect();
  }
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }
  
  try {
    const { page = 1, limit = 10, status, categoryId, keyword } = req.query;
    const skip = (page - 1) * limit;
    
    // Xây dựng query
    let query = { status: "Active" };
    if (status) query.status = status;
    if (categoryId && categoryId !== 'all') query.categoryId = categoryId;
    if (keyword && keyword.trim()) {
      query.$or = [
        { jobTitle: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } }
      ];
    }

    // Sử dụng aggregate pipeline để tránh N+1 query
    const pipeline = [
      { $match: query },
      {
        $lookup: {
          from: 'categories',
          localField: 'categoryId',
          foreignField: '_id',
          as: 'category'
        }
      },
      {
        $lookup: {
          from: 'auths',
          localField: 'employerId',
          foreignField: '_id',
          as: 'employer'
        }
      },
      {
        $lookup: {
          from: 'employers',
          localField: 'employerId',
          foreignField: 'userId',
          as: 'employerProfile'
        }
      },
      {
        $addFields: {
          categoryId: { $arrayElemAt: ['$category', 0] },
          employerId: { $arrayElemAt: ['$employer', 0] },
          employerLogo: { $arrayElemAt: ['$employerProfile.companyLogoUrl', 0] }
        }
      },
      {
        $project: {
          category: 0,
          employer: 0,
          employerProfile: 0
        }
      },
      { $sort: { postedDate: -1 } },
      { $skip: skip },
      { $limit: parseInt(limit) }
    ];

    // Thực hiện aggregate query
    const jobs = await Jobs.aggregate(pipeline);
    const total = await Jobs.countDocuments(query);

    return res.status(200).json({
      success: true,
      data: jobs,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error in job/all API:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách công việc',
      error: error.message
    });
  }
};
