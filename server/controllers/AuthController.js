const Auth = require("../models/Auth");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { createTransporter, getResetPasswordTemplate } = require("../utils/emailConfig");

class AuthController {
  // Đăng ký tài khoản nhà tuyển dụng
  async registerEmployer(req, res) {
    try {
      const { email, password, companyName, phone, address } = req.body;

      // Kiểm tra email đã tồn tại chưa
      const existingUser = await Auth.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email đã tồn tại" });
      }

      // Tạo tài khoản nhà tuyển dụng mới (password sẽ được mã hóa tự động bởi middleware pre-save)
      const newEmployer = new Auth({
        email,
        password, // Không mã hóa ở đây, để middleware xử lý
        role: "employer",
        companyName,
        phone,
        address,
        status: "active",
      });

      await newEmployer.save();

      res.status(201).json({ message: "Đăng ký nhà tuyển dụng thành công" });
    } catch (error) {
      console.error("Lỗi đăng ký nhà tuyển dụng:", error);
      res.status(500).json({ message: "Lỗi máy chủ" });
    }
  }

  // Đăng ký tài khoản ứng viên
  async registerCandidate(req, res) {
    try {
      const { phone, password, fullName, email, address } = req.body;

      // Kiểm tra số điện thoại đã tồn tại chưa
      const existingUser = await Auth.findOne({ phone });
      if (existingUser) {
        return res.status(400).json({ message: "Số điện thoại đã tồn tại" });
      }

      // Tạo tài khoản ứng viên mới (password sẽ được mã hóa tự động bởi middleware pre-save)
      const newCandidate = new Auth({
        phone,
        password, // Không mã hóa ở đây, để middleware xử lý
        role: "candidate",
        fullName,
        email,
        address,
        status: "active",
      });

      await newCandidate.save();

      res.status(201).json({ message: "Đăng ký ứng viên thành công" });
    } catch (error) {
      console.error("Lỗi đăng ký ứng viên:", error);
      res.status(500).json({ message: "Lỗi máy chủ" });
    }
  }

  // Đăng nhập cho cả nhà tuyển dụng và ứng viên
  async login(req, res) {
    try {
      const { email, phone, password, role } = req.body;

      let user;

      // Xác định phương thức đăng nhập dựa vào role
      if (role === "employer") {
        // Nhà tuyển dụng đăng nhập bằng email
        if (!email) {
          return res.status(400).json({ message: "Vui lòng nhập email" });
        }
        user = await Auth.findOne({ email, role: "employer" });
      } else if (role === "candidate") {
        // Ứng viên đăng nhập bằng số điện thoại
        if (!phone) {
          return res
            .status(400)
            .json({ message: "Vui lòng nhập số điện thoại" });
        }
        user = await Auth.findOne({ phone, role: "candidate" });
      } else {
        return res.status(400).json({ message: "Vai trò không hợp lệ" });
      }

      if (!user) {
        return res
          .status(400)
          .json({ message: "Thông tin đăng nhập không hợp lệ" });
      }

      // Kiểm tra trạng thái tài khoản
      if (user.status !== "active") {
        return res.status(400).json({ message: "Tài khoản không hoạt động" });
      }

      // Xác thực mật khẩu
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ message: "Thông tin đăng nhập không hợp lệ" });
      }

      // Tạo JWT token
      const token = jwt.sign(
        {
          userId: user._id,
          role: user.role,
          email: user.email,
          phone: user.phone,
        },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );

      res.json({
        token,
        user: {
          id: user._id,
          email: user.email,
          phone: user.phone,
          role: user.role,
          fullName: user.fullName,
          companyName: user.companyName,
        },
      });
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      res.status(500).json({ message: "Lỗi máy chủ" });
    }
  }

  // Quên mật khẩu
  async forgotPassword(req, res) {
    // Xóa toàn bộ các hàm và logic forgotPassword, resetPassword, verifyResetToken, các biến/tạo resetToken, gửi email reset, ...
  }

  // Đặt lại mật khẩu
  async resetPassword(req, res) {
    // Xóa toàn bộ các hàm và logic forgotPassword, resetPassword, verifyResetToken, các biến/tạo resetToken, gửi email reset, ...
  }
}

module.exports = {
  registerCandidate,
  registerEmployer,
  login,
  forgotPassword,
  resetPassword,
  verifyResetToken,
  getCandidateRegistrations,
  getEmployerRegistrations,
  getLoginData
};
