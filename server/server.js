const express = require("express");
const cors = require("cors");
const corsOptions = {
  origin: "http://localhost:5173",
};
const mongoose = require("mongoose");
const jobController = require('./controllers/jobController');
const categoryController = require('./controllers/categoryController');
const multer = require('multer');
const path = require('path');

const app = express();
app.use(cors(corsOptions));
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/khoaluan");

const Job = require("./models/Job");

// Cấu hình nơi lưu file và tên file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

app.get("/api/jobs", jobController.getAllJobs);
app.get("/api/jobs/:id", jobController.getJobById);
app.post("/api/jobs", jobController.createJob);
app.put("/api/jobs/:id", jobController.updateJob);
app.delete("/api/jobs/:id", jobController.deleteJob);

// Category routes
app.get("/api/categories", categoryController.getAllCategories);
app.post("/api/categories", categoryController.createCategory);
app.put("/api/categories/:id", categoryController.updateCategory);
app.delete("/api/categories/:id", categoryController.deleteCategory);

// Route upload file logo
app.post('/api/upload-logo', upload.single('logo'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  res.json({ logo: `http://localhost:3000/uploads/${req.file.filename}` });
});

// Cho phép truy cập file tĩnh
app.use('/uploads', express.static('uploads'));

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

