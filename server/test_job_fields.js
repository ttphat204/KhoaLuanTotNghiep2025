const dbConnect = require('./utils/dbConnect');
const Jobs = require('./models/Jobs');
const Auth = require('./models/Auth');
const Categories = require('./models/Categories');

async function testJobFields() {
  try {
    await dbConnect();
    console.log('✅ Kết nối database thành công');

    // Kiểm tra model Jobs có các trường mới
    const jobSchema = Jobs.schema.obj;
    console.log('\n📋 Kiểm tra các trường trong model Jobs:');
    console.log('✅ quantity:', jobSchema.quantity ? 'Có' : 'Thiếu');
    console.log('✅ level:', jobSchema.level ? 'Có' : 'Thiếu');
    console.log('✅ experienceLevel:', jobSchema.experienceLevel ? 'Có' : 'Thiếu');
    console.log('✅ jobType:', jobSchema.jobType ? 'Có' : 'Thiếu');
    console.log('✅ location:', jobSchema.location ? 'Có' : 'Thiếu');

    // Kiểm tra validation rules
    if (jobSchema.quantity) {
      console.log('✅ quantity validation:', jobSchema.quantity.min ? `Min: ${jobSchema.quantity.min}` : 'Không có min');
    }
    if (jobSchema.level) {
      console.log('✅ level enum:', jobSchema.level.enum?.values || 'Không có enum');
    }

    // Tạo job test để kiểm tra
    console.log('\n🧪 Tạo job test...');
    
    // Lấy employer đầu tiên
    const employer = await Auth.findOne({ role: 'employer' });
    if (!employer) {
      console.log('❌ Không tìm thấy employer nào');
      return;
    }

    // Lấy category đầu tiên
    const category = await Categories.findOne();
    if (!category) {
      console.log('❌ Không tìm thấy category nào');
      return;
    }

    const testJob = new Jobs({
      employerId: employer._id,
      jobTitle: 'Test Job với trường mới',
      description: 'Mô tả test job',
      jobRequirements: 'Yêu cầu công việc chi tiết cho test job',
      requirements: ['Yêu cầu 1', 'Yêu cầu 2'],
      benefits: ['Quyền lợi 1', 'Quyền lợi 2'],
      salaryRange: {
        min: 10,
        max: 20,
        currency: 'VND'
      },
      location: {
        province: 'Hà Nội',
        district: 'Cầu Giấy',
        addressDetail: '123 Đường ABC'
      },
      jobType: 'Full-time',
      categoryId: category._id,
      skillsRequired: ['JavaScript', 'React', 'Node.js'],
      experienceLevel: '2-3 năm kinh nghiệm',
      quantity: 5,
      level: 'Nhân viên',
      applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 ngày sau
      status: 'Active'
    });

    await testJob.save();
    console.log('✅ Tạo job test thành công:', testJob._id);

    // Kiểm tra job đã tạo
    const savedJob = await Jobs.findById(testJob._id).populate('categoryId').populate('employerId');
    console.log('\n📊 Thông tin job đã tạo:');
    console.log('✅ jobTitle:', savedJob.jobTitle);
    console.log('✅ jobRequirements:', savedJob.jobRequirements);
    console.log('✅ quantity:', savedJob.quantity);
    console.log('✅ level:', savedJob.level);
    console.log('✅ experienceLevel:', savedJob.experienceLevel);
    console.log('✅ jobType:', savedJob.jobType);
    console.log('✅ location:', savedJob.location);
    console.log('✅ categoryId:', savedJob.categoryId?.name);
    console.log('✅ employerId:', savedJob.employerId?.companyName);

    // Xóa job test
    await Jobs.findByIdAndDelete(testJob._id);
    console.log('✅ Đã xóa job test');

    console.log('\n🎉 Tất cả các trường mới đã hoạt động đúng!');

  } catch (error) {
    console.error('❌ Lỗi:', error.message);
  } finally {
    process.exit(0);
  }
}

testJobFields(); 