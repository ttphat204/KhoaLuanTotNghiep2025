const dbConnect = require('../../utils/dbConnect');
const Auth = require('../../models/Auth');
const Employers = require('../../models/Employers');
const Jobs = require('../../models/Jobs');
const Categories = require('../../models/Categories');

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
      const totalJobs = await Jobs.countDocuments();
      const totalEmployers = await Auth.countDocuments({ role: 'employer' });
      
      return res.status(200).json({
        message: 'API Quản lý Công việc',
        methods: {
          'GET /api/job/manage?employerId={employerId}': 'Lấy danh sách công việc của employer',
          'GET /api/job/manage?employerId={employerId}&jobId={jobId}': 'Lấy thông tin công việc cụ thể',
          'POST /api/job/manage': 'Tạo công việc mới',
          'PUT /api/job/manage': 'Cập nhật công việc',
          'DELETE /api/job/manage': 'Xóa công việc'
        },
        requiredFields: ['employerId'],
        description: 'Quản lý công việc cho nhà tuyển dụng',
        databaseStats: {
          totalJobs,
          totalEmployers
        },
        example: {
          createJob: {
            employerId: '65a1b2c3d4e5f6789012345',
            jobTitle: 'Frontend Developer',
            description: 'Phát triển giao diện người dùng',
            requirements: ['React', 'JavaScript', 'HTML/CSS'],
            benefits: ['Lương cao', 'Bảo hiểm', 'Đào tạo'],
            salaryRange: { min: 15000000, max: 25000000, currency: 'VND' },
            location: 'TP.HCM',
            jobType: 'Full-time',
            categoryId: '65a1b2c3d4e5f6789012346',
            skillsRequired: ['React', 'JavaScript', 'TypeScript'],
            experienceLevel: 'Mid-level',
            applicationDeadline: '2024-12-31'
          }
        }
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Lỗi khi lấy dữ liệu',
        error: error.message
      });
    }
  }

  await dbConnect();

  try {
    switch (req.method) {
      case 'GET':
        return await getJobs(req, res);
      case 'POST':
        return await createJob(req, res);
      case 'PUT':
        return await updateJob(req, res);
      case 'DELETE':
        return await deleteJob(req, res);
      default:
        return res.status(405).json({ 
          message: 'Method Not Allowed',
          allowedMethods: ['GET', 'POST', 'PUT', 'DELETE']
        });
    }
  } catch (error) {
    console.error('Job Management Error:', error);
    return res.status(500).json({ 
      message: 'Lỗi server', 
      error: error.message 
    });
  }
};

// GET - Lấy danh sách công việc hoặc công việc cụ thể
async function getJobs(req, res) {
  try {
    const { employerId, jobId, page = 1, limit = 10, status } = req.query;
    
    if (!employerId) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu employerId'
      });
    }

    // Verify employer exists
    const employer = await Auth.findById(employerId);
    if (!employer || employer.role !== 'employer') {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy nhà tuyển dụng'
      });
    }

    // Nếu có jobId, lấy công việc cụ thể
    if (jobId) {
      const job = await Jobs.findOne({ _id: jobId, employerId }).populate('categoryId', 'name');
      if (!job) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy công việc'
        });
      }
      
      return res.status(200).json({
        success: true,
        data: job
      });
    }

    // Lấy danh sách công việc
    const skip = (page - 1) * limit;
    let query = { employerId };
    
    // Lọc theo status
    if (status) {
      query.status = status;
    }

    const jobs = await Jobs.find(query)
      .populate('categoryId', 'name')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ postedDate: -1 });

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
    return res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách công việc',
      error: error.message
    });
  }
}

// POST - Tạo công việc mới
async function createJob(req, res) {
  try {
    const {
      employerId,
      jobTitle,
      description,
      requirements,
      benefits,
      salaryRange,
      location,
      jobType,
      categoryId,
      skillsRequired,
      experienceLevel,
      applicationDeadline
    } = req.body;

    // Validation
    if (!employerId || !jobTitle || !description || !salaryRange || !location || 
        !jobType || !categoryId || !experienceLevel || !applicationDeadline) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin bắt buộc'
      });
    }

    // Verify employer exists
    const employer = await Auth.findById(employerId);
    if (!employer || employer.role !== 'employer') {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy nhà tuyển dụng'
      });
    }

    // Verify category exists
    const category = await Categories.findById(categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy danh mục công việc'
      });
    }

    // Validate job type
    const validJobTypes = ['Full-time', 'Part-time', 'Remote', 'Internship', 'Contract'];
    if (!validJobTypes.includes(jobType)) {
      return res.status(400).json({
        success: false,
        message: 'Loại hình công việc không hợp lệ'
      });
    }

    // Validate experience level
    const validExperienceLevels = ['Entry-level', 'Mid-level', 'Senior', 'Lead', 'Manager'];
    if (!validExperienceLevels.includes(experienceLevel)) {
      return res.status(400).json({
        success: false,
        message: 'Cấp độ kinh nghiệm không hợp lệ'
      });
    }

    // Validate salary range
    if (salaryRange.min < 0 || salaryRange.max < 0 || salaryRange.min > salaryRange.max) {
      return res.status(400).json({
        success: false,
        message: 'Mức lương không hợp lệ'
      });
    }

    // Validate application deadline
    const deadline = new Date(applicationDeadline);
    if (deadline <= new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Hạn nộp hồ sơ phải lớn hơn ngày hiện tại'
      });
    }

    // Create job
    const job = new Jobs({
      employerId,
      jobTitle,
      description,
      requirements: requirements || [],
      benefits: benefits || [],
      salaryRange,
      location,
      jobType,
      categoryId,
      skillsRequired: skillsRequired || [],
      experienceLevel,
      applicationDeadline: deadline,
      status: 'Active'
    });

    await job.save();

    // Populate category name
    await job.populate('categoryId', 'name');

    return res.status(201).json({
      success: true,
      message: 'Tạo công việc thành công',
      data: job
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Lỗi khi tạo công việc',
      error: error.message
    });
  }
}

// PUT - Cập nhật công việc
async function updateJob(req, res) {
  try {
    const { jobId, employerId, ...updateData } = req.body;

    if (!jobId || !employerId) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu jobId hoặc employerId'
      });
    }

    // Find job
    const job = await Jobs.findOne({ _id: jobId, employerId });
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy công việc'
      });
    }

    // Validate job type if provided
    if (updateData.jobType) {
      const validJobTypes = ['Full-time', 'Part-time', 'Remote', 'Internship', 'Contract'];
      if (!validJobTypes.includes(updateData.jobType)) {
        return res.status(400).json({
          success: false,
          message: 'Loại hình công việc không hợp lệ'
        });
      }
    }

    // Validate experience level if provided
    if (updateData.experienceLevel) {
      const validExperienceLevels = ['Entry-level', 'Mid-level', 'Senior', 'Lead', 'Manager'];
      if (!validExperienceLevels.includes(updateData.experienceLevel)) {
        return res.status(400).json({
          success: false,
          message: 'Cấp độ kinh nghiệm không hợp lệ'
        });
      }
    }

    // Validate salary range if provided
    if (updateData.salaryRange) {
      if (updateData.salaryRange.min < 0 || updateData.salaryRange.max < 0 || 
          updateData.salaryRange.min > updateData.salaryRange.max) {
        return res.status(400).json({
          success: false,
          message: 'Mức lương không hợp lệ'
        });
      }
    }

    // Validate application deadline if provided
    if (updateData.applicationDeadline) {
      const deadline = new Date(updateData.applicationDeadline);
      if (deadline <= new Date()) {
        return res.status(400).json({
          success: false,
          message: 'Hạn nộp hồ sơ phải lớn hơn ngày hiện tại'
        });
      }
      updateData.applicationDeadline = deadline;
    }

    // Update job
    Object.assign(job, updateData);
    await job.save();

    // Populate category name
    await job.populate('categoryId', 'name');

    return res.status(200).json({
      success: true,
      message: 'Cập nhật công việc thành công',
      data: job
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật công việc',
      error: error.message
    });
  }
}

// DELETE - Xóa công việc
async function deleteJob(req, res) {
  try {
    const { jobId, employerId } = req.body;

    if (!jobId || !employerId) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu jobId hoặc employerId'
      });
    }

    const job = await Jobs.findOne({ _id: jobId, employerId });
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy công việc'
      });
    }

    await Jobs.findByIdAndDelete(jobId);

    return res.status(200).json({
      success: true,
      message: 'Xóa công việc thành công',
      deletedJob: {
        id: job._id,
        jobTitle: job.jobTitle,
        location: job.location,
        status: job.status
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa công việc',
      error: error.message
    });
  }
} 