const express = require("express");
const router = express.Router();
const authRouter = require("./auth.router");
const userRouter = require("./user.router");
const cvRouter = require("./cv.router");
const jobRouter = require("./job.router");
const applicationRouter = require("./application.router");
const companyRouter = require("./company.router");
const notificationRouter = require("./notification.router");
const interviewRouter = require("./interview.router");

// Mount routes
router.use("/auth", authRouter);
router.use("/user", userRouter);
router.use("/cv", cvRouter);
router.use("/jobs", jobRouter);
router.use("/applications", applicationRouter);
router.use("/companies", companyRouter);
router.use("/notifications", notificationRouter);
router.use("/interviews", interviewRouter);

module.exports = router;
