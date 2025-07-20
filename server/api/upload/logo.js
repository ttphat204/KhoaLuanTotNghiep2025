const express = require('express');
const multer = require('multer');
const router = express.Router();

console.log('Upload API loaded');

// Cấu hình multer với memory storage
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    // Cho phép tất cả các loại file
    cb(null, true);
  }
});

// Route POST cho upload
router.post('/', upload.single('file'), (req, res) => {
  console.log('Upload request received');
  
  try {
    // Kiểm tra file
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Không có file được upload'
      });
    }

    // Chuyển file thành base64
    const base64String = req.file.buffer.toString('base64');
    const mimeType = req.file.mimetype;
    const dataUrl = `data:${mimeType};base64,${base64String}`;

    // Trả về URL base64
    res.json({
      success: true,
      message: 'Upload thành công',
      url: dataUrl,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      mimeType: mimeType
    });
    
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi upload file',
      error: error.message
    });
  }
});

// Error handling
router.use((error, req, res, next) => {
  console.error('Upload middleware error:', error);
  
  res.status(400).json({
    success: false,
    message: error.message || 'Lỗi upload file'
  });
});

module.exports = router; 