const express = require("express");
const router = express.Router();
const JobController = require("../controllers/JobController");
const { getEmployerDashboard } = require('../controllers/JobController');
const employerAuth = require('../middleware/employerAuth');

// Middleware xác thực JWT
const authenticateToken = require("../middleware/auth");

// Middleware xác thực employer
const { jobOwnership } = require("../middleware/employerAuth");

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

// Quản lý tin tuyển dụng (chỉ nhà tuyển dụng) - Sử dụng middleware employerAuth
router.post("/", employerAuth, JobController.createJob);
router.get("/employer/dashboard", employerAuth, getEmployerDashboard);
router.get("/employer/all-jobs", employerAuth, JobController.getAllEmployerJobs);
router.get("/employer/jobs", employerAuth, JobController.getEmployerJobs);
router.get("/employer/jobs/:jobId", employerAuth, jobOwnership, JobController.getEmployerJobDetail);
router.get("/employer/stats", employerAuth, JobController.getEmployerJobStats);
router.put("/:jobId", employerAuth, jobOwnership, JobController.updateJob);
router.patch("/:jobId/status", employerAuth, jobOwnership, JobController.updateJobStatus);
router.patch("/:jobId/featured", employerAuth, jobOwnership, JobController.toggleFeaturedJob);
router.delete("/:jobId", employerAuth, jobOwnership, JobController.deleteJob);

module.exports = router;
