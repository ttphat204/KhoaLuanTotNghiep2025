const dbConnect = require('../../utils/dbConnect');
const Auth = require('../../models/Auth');
const Employers = require('../../models/Employers');
const Jobs = require('../../models/Jobs');
const Categories = require('../../models/Categories');

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

  // Chỉ connect nếu chưa connected


  await dbConnect();

  // API GET: Lấy danh sách jobs hoặc job cụ thể
  if (req.method === 'GET') {
    try {
      const { employerId, jobId, page = 1, limit = 10, status } = req.query;
      
      console.log('--- [GET Jobs] ---');
      console.log('employerId:', employerId);
      console.log('jobId:', jobId);
      console.log('page:', page, 'limit:', limit, 'status:', status);

      // Nếu có jobId, lấy chi tiết một job
      if (jobId) {
        if (!employerId) {
          return res.status(400).json({ 
            success: false,
            message: 'Thiếu employerId' 
          });
        }

        const job = await Jobs.findOne({ _id: jobId, employerId })
          .populate('categoryId', 'name')
          .populate('employerId', 'companyName email phone');
        
        if (!job) {
          return res.status(404).json({ 
            success: false,
            message: 'Không tìm thấy công việc' 
          });
        }

        return res.json({
          success: true,
          data: job
        });
      }

      // Nếu có employerId, lấy danh sách jobs của employer đó
      if (employerId) {
        // Verify employer exists trong bảng Employers
        const employer = await Auth.findById(employerId);
        if (!employer) {
          return res.status(404).json({ 
            success: false,
            message: 'Không tìm thấy nhà tuyển dụng' 
          });
        }

        const skip = (page - 1) * limit;
        let query = { employerId };
        if (status) {
          query.status = status;
        }

        console.log('Query jobs:', query);
        const jobs = await Jobs.find(query)
          .populate('categoryId', 'name')
          .populate('employerId', 'companyName email phone')
          .skip(skip)
          .limit(parseInt(limit))
          .sort({ postedDate: -1 });

        const total = await Jobs.countDocuments(query);
        console.log('Số lượng jobs tìm thấy:', jobs.length, '/ Tổng:', total);

        return res.json({
          success: true,
          data: jobs,
          pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / limit),
            totalItems: total,
            itemsPerPage: parseInt(limit)
          }
        });
      }

      // Nếu không có employerId, trả về thông tin API
      const totalJobs = await Jobs.countDocuments();
      const totalEmployers = await Auth.countDocuments();
      
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
        }
      });
    } catch (error) {
      console.error('[GET Jobs] Lỗi:', error);
      return res.status(500).json({ 
        success: false,
        message: 'Lỗi khi lấy danh sách công việc', 
        error: error.message 
      });
    }
  }

  // Endpoint GET /api/job/all: trả về tất cả jobs cho candidate
  if (req.method === 'GET' && req.url.startsWith('/api/job/all')) {
    try {
      // Đảm bảo model Auth đã được đăng ký
      const Auth = require('../../models/Auth');
      const { page = 1, limit = 10, status } = req.query;
      const skip = (page - 1) * limit;
      let query = {};
      if (status) query.status = status;
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

  // API POST: Tạo công việc mới
  if (req.method === 'POST') {
    try {
      const {
        employerId,
        jobTitle,
        description,
        requirements,
        jobRequirements,
        benefits,
        salaryRange,
        location,
        jobType,
        categoryId,
        skillsRequired,
        experienceLevel,
        quantity,
        level,
        applicationDeadline
      } = req.body;

      console.log('--- [POST Create Job] ---');
      console.log('employerId:', employerId);
      console.log('jobTitle:', jobTitle);

      // Validation
      if (!employerId || !jobTitle || !description || !salaryRange || !location || 
          !jobType || !categoryId || !experienceLevel || !quantity || !level || !applicationDeadline) {
        return res.status(400).json({
          success: false,
          message: 'Thiếu thông tin bắt buộc'
        });
      }

      // Verify employer exists trong bảng Employers
      const employer = await Auth.findById(employerId);
      if (!employer) {
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

      // Validate experience level - chỉ kiểm tra không rỗng
      if (!experienceLevel || experienceLevel.trim() === '') {
        return res.status(400).json({
          success: false,
          message: 'Cấp độ kinh nghiệm không được để trống'
        });
      }

      // Validate quantity
      if (quantity < 1) {
        return res.status(400).json({
          success: false,
          message: 'Số lượng tuyển dụng phải lớn hơn 0'
        });
      }

      // Validate level - chỉ kiểm tra không rỗng
      if (!level || level.trim() === '') {
        return res.status(400).json({
          success: false,
          message: 'Cấp bậc công việc không được để trống'
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
        employerId, // Sử dụng employerId từ bảng Employers
        jobTitle,
        description,
        requirements: requirements || [],
        jobRequirements,
        benefits: benefits || [],
        salaryRange,
        location,
        jobType,
        categoryId,
        skillsRequired: skillsRequired || [],
        experienceLevel,
        quantity,
        level,
        applicationDeadline: deadline,
        status: 'Active'
      });

      await job.save();

      // Populate category name và employer info
      await job.populate('categoryId', 'name');
      await job.populate('employerId', 'companyName email phone');

      console.log('Tạo job thành công:', job._id);
      return res.status(201).json({
        success: true,
        message: 'Tạo công việc thành công',
        data: job
      });
    } catch (error) {
      console.error('[POST Create Job] Lỗi:', error);
      return res.status(500).json({
        success: false,
        message: 'Lỗi khi tạo công việc',
        error: error.message
      });
    }
  }

  // API PUT: Cập nhật công việc
  if (req.method === 'PUT') {
    try {
      const { jobId, employerId, ...updateData } = req.body;

      console.log('--- [PUT Update Job] ---');
      console.log('jobId:', jobId);
      console.log('employerId:', employerId);

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
        if (!updateData.experienceLevel.trim()) {
          return res.status(400).json({
            success: false,
            message: 'Cấp độ kinh nghiệm không được để trống'
          });
        }
      }

      // Validate quantity if provided
      if (updateData.quantity !== undefined) {
        if (updateData.quantity < 1) {
          return res.status(400).json({
            success: false,
            message: 'Số lượng tuyển dụng phải lớn hơn 0'
          });
        }
      }

      // Validate level if provided
      if (updateData.level) {
        if (!updateData.level.trim()) {
          return res.status(400).json({
            success: false,
            message: 'Cấp bậc công việc không được để trống'
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

      // Populate category name và employer info
      await job.populate('categoryId', 'name');
      await job.populate('employerId', 'companyName email phone');

      console.log('Cập nhật job thành công:', job._id);
      return res.status(200).json({
        success: true,
        message: 'Cập nhật công việc thành công',
        data: job
      });
    } catch (error) {
      console.error('[PUT Update Job] Lỗi:', error);
      return res.status(500).json({
        success: false,
        message: 'Lỗi khi cập nhật công việc',
        error: error.message
      });
    }
  }

  // API DELETE: Xóa công việc
  if (req.method === 'DELETE') {
    try {
      const { jobId, employerId } = req.body;

      console.log('--- [DELETE Job] ---');
      console.log('jobId:', jobId);
      console.log('employerId:', employerId);

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

      console.log('Xóa job thành công:', jobId);
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
      console.error('[DELETE Job] Lỗi:', error);
      return res.status(500).json({
        success: false,
        message: 'Lỗi khi xóa công việc',
        error: error.message
      });
    }
  }

  return res.status(405).json({ 
    success: false,
    message: 'Method Not Allowed',
    allowedMethods: ['GET', 'POST', 'PUT', 'DELETE']
  });
}

module.exports = handler; 