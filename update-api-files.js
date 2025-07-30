const fs = require('fs');
const path = require('path');

// Danh sách các file cần cập nhật
const filesToUpdate = [
  // Server 1
  'server/api/auth/register/candidate.js',
  'server/api/auth/register/employer.js',
  'server/api/auth/register/admin.js',
  'server/api/job/manage.js',
  'server/api/job/employer-dashboard.js',
  'server/api/candidate/profile.js',
  'server/api/employer/profile.js',
  'server/controllers/jobController.js',
  'server/api/admin/employer-management.js',
  'server/api/admin/category-management.js',
  
  // Server 2
  'server2/controllers/jobController.js',
  'server2/api/jobs/all.js',
  'server2/api/job/[jobId].js',
  'server2/api/index.js',
  'server2/api/favorite-jobs/index.js',
  'server2/api/employer-dashboard-stats.js',
  'server2/api/application/submit.js',
  'server2/api/application/job/[jobId].js',
  'server2/api/application/all.js'
];

function updateFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File không tồn tại: ${filePath}`);
      return;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    let updated = false;

    // Cập nhật import dbConnect
    if (content.includes("const dbConnect = require('../../utils/dbConnect');")) {
      content = content.replace(
        "const dbConnect = require('../../utils/dbConnect');",
        "const { dbConnect, isConnected } = require('../../utils/dbConnect');"
      );
      updated = true;
    }
    
    if (content.includes("const dbConnect = require('../../../utils/dbConnect');")) {
      content = content.replace(
        "const dbConnect = require('../../../utils/dbConnect');",
        "const { dbConnect, isConnected } = require('../../../utils/dbConnect');"
      );
      updated = true;
    }
    
    if (content.includes("const dbConnect = require('../utils/dbConnect');")) {
      content = content.replace(
        "const dbConnect = require('../utils/dbConnect');",
        "const { dbConnect, isConnected } = require('../utils/dbConnect');"
      );
      updated = true;
    }

    // Cập nhật await dbConnect() calls
    const dbConnectPattern = /(\s+)await dbConnect\(\);/g;
    if (dbConnectPattern.test(content)) {
      content = content.replace(
        dbConnectPattern,
        '$1// Chỉ connect nếu chưa connected\n$1if (!isConnected()) {\n$1  await dbConnect();\n$1}'
      );
      updated = true;
    }

    if (updated) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Đã cập nhật: ${filePath}`);
    } else {
      console.log(`ℹ️  Không cần cập nhật: ${filePath}`);
    }

  } catch (error) {
    console.error(`❌ Lỗi khi cập nhật ${filePath}:`, error.message);
  }
}

// Chạy cập nhật
console.log('🚀 Bắt đầu cập nhật các API files...\n');

filesToUpdate.forEach(file => {
  updateFile(file);
});

console.log('\n✅ Hoàn thành cập nhật!');
console.log('\n📋 Lưu ý:');
console.log('1. Kiểm tra lại các file đã cập nhật');
console.log('2. Test API để đảm bảo hoạt động bình thường');
console.log('3. Deploy lên production'); 