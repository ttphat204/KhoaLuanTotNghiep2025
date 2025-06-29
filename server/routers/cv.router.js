const express = require("express");
const router = express.Router();
const CVController = require("../controllers/CVController");
const multer = require("multer");
const path = require("path");

// Middleware xác thực JWT
const authenticateToken = require("../middleware/auth");

// Cấu hình multer cho upload file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/resumes/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = [".pdf", ".doc", ".docx"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Chỉ chấp nhận file PDF, DOC, DOCX"), false);
    }
  },
});

// Áp dụng middleware xác thực cho tất cả routes
router.use(authenticateToken);

// Quản lý CV cơ bản
router.post("/", CVController.createResume);
router.get("/", CVController.getResumes);
router.get("/:resumeId", CVController.getResumeById);
router.put("/:resumeId", CVController.updateResume);
router.delete("/:resumeId", CVController.deleteResume);

// Upload file CV
router.post(
  "/:resumeId/upload",
  upload.single("resumeFile"),
  CVController.uploadResumeFile
);

// Quản lý học vấn
router.post("/:resumeId/education", CVController.addEducation);
router.put("/:resumeId/education/:educationId", CVController.updateEducation);
router.delete(
  "/:resumeId/education/:educationId",
  CVController.deleteEducation
);

// Quản lý kinh nghiệm làm việc
router.post("/:resumeId/work-experience", CVController.addWorkExperience);
router.put(
  "/:resumeId/work-experience/:experienceId",
  CVController.updateWorkExperience
);
router.delete(
  "/:resumeId/work-experience/:experienceId",
  CVController.deleteWorkExperience
);

// Quản lý kỹ năng
router.post("/:resumeId/skills", CVController.addSkill);
router.put("/:resumeId/skills/:skillId", CVController.updateSkill);
router.delete("/:resumeId/skills/:skillId", CVController.deleteSkill);

// Quản lý ngoại ngữ
router.post("/:resumeId/languages", CVController.addLanguage);
router.put("/:resumeId/languages/:languageId", CVController.updateLanguage);
router.delete("/:resumeId/languages/:languageId", CVController.deleteLanguage);

// Quản lý chứng chỉ/bằng cấp
router.post("/:resumeId/certifications", CVController.addCertification);
router.put(
  "/:resumeId/certifications/:certificationId",
  CVController.updateCertification
);
router.delete(
  "/:resumeId/certifications/:certificationId",
  CVController.deleteCertification
);

// Quản lý dự án/thành tựu
router.post("/:resumeId/projects", CVController.addProject);
router.put("/:resumeId/projects/:projectId", CVController.updateProject);
router.delete("/:resumeId/projects/:projectId", CVController.deleteProject);

module.exports = router;
