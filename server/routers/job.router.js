const express = require("express");
const router = express.Router();
const JobController = require("../controllers/JobController");

// Middleware xác thực JWT
const authenticateToken = require("../middleware/auth");

// Routes công khai (không cần xác thực)
router.get("/search", JobController.searchJobs);
router.get("/filter", JobController.filterJobs);
router.get("/featured", JobController.getFeaturedJobs);
router.get("/latest", JobController.getLatestJobs);
router.get("/:jobId", JobController.getJobById);
router.post("/:jobId/report", authenticateToken, JobController.reportJob);
router.post("/:jobId/share", JobController.shareJob);

// Routes cần xác thực
router.use(authenticateToken);

// Quản lý tin tuyển dụng (chỉ nhà tuyển dụng)
router.post("/", JobController.createJob);
router.get("/employer/jobs", JobController.getEmployerJobs);
router.put("/:jobId", JobController.updateJob);
router.delete("/:jobId", JobController.deleteJob);
router.get("/employer/stats", JobController.getJobStats);

module.exports = router;
