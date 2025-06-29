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

      // Mã hóa mật khẩu
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Tạo tài khoản nhà tuyển dụng mới
      const newEmployer = new Auth({
        email,
        password: hashedPassword,
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

      // Mã hóa mật khẩu
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Tạo tài khoản ứng viên mới
      const newCandidate = new Auth({
        phone,
        password: hashedPassword,
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
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ message: "Vui lòng nhập email" });
      }

      // Tìm user theo email
      const user = await Auth.findOne({ email });
      if (!user) {
        return res.status(404).json({ 
          message: "Email không tồn tại trong hệ thống" 
        });
      }

      // Tạo reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

      // Lưu token và thời gian hết hạn (1 giờ)
      user.resetPasswordToken = resetPasswordToken;
      user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 giờ
      await user.save();

      // Tạo reset URL
      const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;

      // Tạo transporter và gửi email
      const transporter = createTransporter();
      const userName = user.fullName || user.companyName || 'Người dùng';
      const htmlContent = getResetPasswordTemplate(userName, resetUrl);

      const mailOptions = {
        from: process.env.EMAIL_USER || 'your-email@gmail.com',
        to: email,
        subject: 'Reset Mật khẩu - Job Portal',
        html: htmlContent
      };

      // Gửi email
      await transporter.sendMail(mailOptions);

      return res.status(200).json({
        message: 'Email reset password đã được gửi. Vui lòng kiểm tra hộp thư của bạn.',
        email: email
      });

    } catch (error) {
      console.error("Lỗi gửi email reset password:", error);
      return res.status(500).json({ 
        message: "Lỗi khi gửi email reset password", 
        error: error.message 
      });
    }
  }

  // Đặt lại mật khẩu
  async resetPassword(req, res) {
    try {
      const { token, newPassword } = req.body;

      if (!token || !newPassword) {
        return res.status(400).json({ 
          message: 'Vui lòng nhập đầy đủ token và mật khẩu mới' 
        });
      }

      // Validate password
      if (newPassword.length < 8) {
        return res.status(400).json({ 
          message: 'Mật khẩu phải có ít nhất 8 ký tự' 
        });
      }

      // Hash token để so sánh
      const resetPasswordToken = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');

      // Tìm user với token hợp lệ và chưa hết hạn
      const user = await Auth.findOne({
        resetPasswordToken: resetPasswordToken,
        resetPasswordExpires: { $gt: Date.now() }
      });

      if (!user) {
        return res.status(400).json({ 
          message: 'Token không hợp lệ hoặc đã hết hạn. Vui lòng yêu cầu reset password mới.' 
        });
      }

      // Hash mật khẩu mới
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      // Cập nhật mật khẩu và xóa token
      user.password = hashedPassword;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();

      return res.status(200).json({
        message: 'Đặt lại mật khẩu thành công. Bạn có thể đăng nhập với mật khẩu mới.',
        email: user.email
      });

    } catch (error) {
      console.error("Lỗi reset password:", error);
      return res.status(500).json({ 
        message: "Lỗi khi đặt lại mật khẩu", 
        error: error.message 
      });
    }
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
