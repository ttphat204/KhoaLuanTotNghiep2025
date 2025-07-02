const Auth = require("../models/Auth");
const Employers = require("../models/Employers");
const Candidates = require("../models/Candidates");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

class UserController {
  // Cập nhật thông tin cá nhân (cho ứng viên)
  async updatePersonalInfo(req, res) {
    try {
      const userId = req.user.userId;
      const {
        fullName,
        phoneNumber,
        city,
        district,
        ward,
        specificAddress,
        dateOfBirth,
        gender,
        bio,
        skills,
        expectedSalary,
        preferredJobTypes,
        preferredLocations,
        isAvailable,
        isPublic,
      } = req.body;

      // Kiểm tra xem người dùng có phải là ứng viên không
      const authUser = await Auth.findById(userId);
      if (!authUser || authUser.role !== "candidate") {
        return res.status(403).json({
          message: "Chỉ ứng viên mới có thể cập nhật thông tin cá nhân",
        });
      }

      // Tìm hoặc tạo thông tin ứng viên
      let candidate = await Candidates.findOne({ userId });

      if (!candidate) {
        // Tạo mới thông tin ứng viên
        candidate = new Candidates({
          userId,
          fullName,
          phoneNumber,
          city,
          district,
          ward,
          specificAddress,
          dateOfBirth,
          gender,
          bio,
          skills,
          expectedSalary,
          preferredJobTypes,
          preferredLocations,
          isAvailable,
          isPublic,
        });
      } else {
        // Cập nhật thông tin hiện có
        Object.assign(candidate, {
          fullName,
          phoneNumber,
          city,
          district,
          ward,
          specificAddress,
          dateOfBirth,
          gender,
          bio,
          skills,
          expectedSalary,
          preferredJobTypes,
          preferredLocations,
          isAvailable,
          isPublic,
        });
      }

      await candidate.save();

      res.json({
        message: "Cập nhật thông tin cá nhân thành công",
        candidate,
      });
    } catch (error) {
      console.error("Lỗi cập nhật thông tin cá nhân:", error);
      res.status(500).json({ message: "Lỗi máy chủ" });
    }
  }

  // Cập nhật thông tin công ty (cho nhà tuyển dụng)
  async updateCompanyInfo(req, res) {
    try {
      const userId = req.user.userId;
      const {
        companyName,
        companyEmail,
        companyPhoneNumber,
        companyAddress,
        companyWebsite,
        companyDescription,
        companyLogoUrl,
        industry,
        companySize,
        foundedYear,
      } = req.body;

      // Kiểm tra xem người dùng có phải là nhà tuyển dụng không
      const authUser = await Auth.findById(userId);
      if (!authUser || authUser.role !== "employer") {
        return res.status(403).json({
          message: "Chỉ nhà tuyển dụng mới có thể cập nhật thông tin công ty",
        });
      }

      // Tìm hoặc tạo thông tin nhà tuyển dụng
      let employer = await Employers.findOne({ userId });

      if (!employer) {
        // Tạo mới thông tin nhà tuyển dụng
        employer = new Employers({
          userId,
          companyName,
          companyEmail,
          companyPhoneNumber,
          companyAddress,
          companyWebsite,
          companyDescription,
          companyLogoUrl,
          industry,
          companySize,
          foundedYear,
        });
      } else {
        // Cập nhật thông tin hiện có
        Object.assign(employer, {
          companyName,
          companyEmail,
          companyPhoneNumber,
          companyAddress,
          companyWebsite,
          companyDescription,
          companyLogoUrl,
          industry,
          companySize,
          foundedYear,
        });
      }

      await employer.save();

      res.json({
        message: "Cập nhật thông tin công ty thành công",
        employer,
      });
    } catch (error) {
      console.error("Lỗi cập nhật thông tin công ty:", error);
      res.status(500).json({ message: "Lỗi máy chủ" });
    }
  }

  // Quản lý tài khoản - Thay đổi mật khẩu
  async changePassword(req, res) {
    try {
      const userId = req.user.userId;
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res
          .status(400)
          .json({ message: "Vui lòng nhập đầy đủ thông tin" });
      }

      // Tìm người dùng
      const user = await Auth.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "Không tìm thấy người dùng" });
      }

      // Kiểm tra mật khẩu hiện tại
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ message: "Mật khẩu hiện tại không đúng" });
      }

      // Cập nhật mật khẩu (password sẽ được mã hóa tự động bởi middleware pre-save)
      user.password = newPassword; // Không mã hóa ở đây, để middleware xử lý
      await user.save();

      res.json({ message: "Thay đổi mật khẩu thành công" });
    } catch (error) {
      console.error("Lỗi thay đổi mật khẩu:", error);
      res.status(500).json({ message: "Lỗi máy chủ" });
    }
  }

  // Quản lý tài khoản - Cập nhật thông tin cơ bản
  async updateAccountInfo(req, res) {
    try {
      const userId = req.user.userId;
      const { email, phone, address } = req.body;

      // Tìm người dùng
      const user = await Auth.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "Không tìm thấy người dùng" });
      }

      // Kiểm tra email đã tồn tại chưa (nếu thay đổi email)
      if (email && email !== user.email) {
        const existingUser = await Auth.findOne({ email });
        if (existingUser) {
          return res.status(400).json({ message: "Email đã tồn tại" });
        }
      }

      // Kiểm tra số điện thoại đã tồn tại chưa (nếu thay đổi số điện thoại)
      if (phone && phone !== user.phone) {
        const existingUser = await Auth.findOne({ phone });
        if (existingUser) {
          return res.status(400).json({ message: "Số điện thoại đã tồn tại" });
        }
      }

      // Cập nhật thông tin
      if (email) user.email = email;
      if (phone) user.phone = phone;
      if (address) user.address = address;

      await user.save();

      res.json({
        message: "Cập nhật thông tin tài khoản thành công",
        user: {
          id: user._id,
          email: user.email,
          phone: user.phone,
          role: user.role,
          fullName: user.fullName,
          companyName: user.companyName,
          address: user.address,
        },
      });
    } catch (error) {
      console.error("Lỗi cập nhật thông tin tài khoản:", error);
      res.status(500).json({ message: "Lỗi máy chủ" });
    }
  }

  // Quản lý tài khoản - Xóa tài khoản
  async deleteAccount(req, res) {
    try {
      const userId = req.user.userId;

      // Xóa tài khoản trong Auth
      await Auth.findByIdAndDelete(userId);

      // Xóa thông tin liên quan (Candidates, Employers, v.v.)
      await Candidates.deleteOne({ userId });
      await Employers.deleteOne({ userId });
      // Thêm các model khác nếu cần

      res.json({ message: "Tài khoản đã được xóa thành công" });
    } catch (error) {
      console.error("Lỗi khi xóa tài khoản:", error);
      res.status(500).json({ message: "Lỗi máy chủ" });
    }
  }

  // Cập nhật liên kết mạng xã hội (cho ứng viên)
  async updateSocialLinks(req, res) {
    try {
      const userId = req.user.userId;
      const { socialLinks } = req.body; // Expects an object like { github: "url", linkedin: "url" }

      const candidate = await Candidates.findOneAndUpdate(
        { userId },
        { socialLinks },
        { new: true, runValidators: true }
      );

      if (!candidate) {
        return res.status(404).json({
          message:
            "Không tìm thấy thông tin ứng viên hoặc bạn không phải là ứng viên.",
        });
      }

      res.json({
        message: "Cập nhật liên kết mạng xã hội thành công",
        socialLinks: candidate.socialLinks,
      });
    } catch (error) {
      console.error("Lỗi khi cập nhật liên kết mạng xã hội:", error);
      res.status(500).json({ message: "Lỗi máy chủ" });
    }
  }

  // Lấy thông tin cá nhân của ứng viên (cho nhà tuyển dụng xem)
  async getPersonalInfo(req, res) {
    try {
      const { candidateId } = req.params; // Lấy ID của ứng viên từ params

      const candidate = await Candidates.findById(candidateId).populate(
        "userId",
        "email"
      );

      if (!candidate) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy thông tin ứng viên" });
      }

      // Kiểm tra xem hồ sơ có công khai không
      if (!candidate.isPublic) {
        // Chỗ này có thể thêm logic kiểm tra xem nhà tuyển dụng có quyền xem hồ sơ không
        // Ví dụ: đã mua gói xem hồ sơ, hoặc ứng viên đã ứng tuyển vào job của họ
        return res
          .status(403)
          .json({ message: "Hồ sơ này không được công khai" });
      }

      res.json({ candidate });
    } catch (error) {
      console.error("Lỗi khi lấy thông tin cá nhân:", error);
      res.status(500).json({ message: "Lỗi máy chủ" });
    }
  }
}

module.exports = new UserController();
