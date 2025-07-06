const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/AuthController");
const { body } = require("express-validator");

// Validation middleware
const validateEmployerRegistration = [
  body("email").isEmail().withMessage("Email không hợp lệ"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Mật khẩu phải có ít nhất 6 ký tự"),
  body("companyName").notEmpty().withMessage("Tên công ty không được để trống"),
  body("phone")
    .matches(/^[0-9]{10}$/)
    .withMessage("Số điện thoại không hợp lệ"),
  body("address").notEmpty().withMessage("Địa chỉ không được để trống"),
];

const validateCandidateRegistration = [
  body("phone")
    .matches(/^[0-9]{10}$/)
    .withMessage("Số điện thoại không hợp lệ"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Mật khẩu phải có ít nhất 6 ký tự"),
  body("fullName").notEmpty().withMessage("Họ tên không được để trống"),
  body("email").optional().isEmail().withMessage("Email không hợp lệ"),
  body("address").notEmpty().withMessage("Địa chỉ không được để trống"),
];

const validateLogin = [
  body("password")
    .isLength({ min: 6 })
    .withMessage("Mật khẩu phải có ít nhất 6 ký tự"),
  body("role")
    .isIn(["employer", "candidate"])
    .withMessage("Vai trò không hợp lệ"),
];

// Routes
// Đăng ký nhà tuyển dụng
router.post(
  "/register/employer",
  validateEmployerRegistration,
  AuthController.registerEmployer
);

// Đăng ký ứng viên
router.post(
  "/register/candidate",
  validateCandidateRegistration,
  AuthController.registerCandidate
);

// Đăng nhập
router.post("/login", validateLogin, AuthController.login);

// GET methods for viewing data
router.get('/register/candidate', AuthController.getCandidateRegistrations);
router.get('/register/employer', AuthController.getEmployerRegistrations);
router.get('/login', AuthController.getLoginData);

module.exports = router;
