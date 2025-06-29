const Resumes = require("../models/Resumes");
const Candidates = require("../models/Candidates");
const Auth = require("../models/Auth");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

class CVController {
  // Tạo CV mới
  async createResume(req, res) {
    try {
      const userId = req.user.userId;
      const { title, isPrimary = false } = req.body;

      // Kiểm tra xem người dùng có phải là ứng viên không
      const authUser = await Auth.findById(userId);
      if (!authUser || authUser.role !== "candidate") {
        return res
          .status(403)
          .json({ message: "Chỉ ứng viên mới có thể tạo CV" });
      }

      // Tìm thông tin ứng viên
      const candidate = await Candidates.findOne({ userId });
      if (!candidate) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy thông tin ứng viên" });
      }

      // Nếu CV mới là primary, hủy primary của các CV khác
      if (isPrimary) {
        await Resumes.updateMany(
          { candidateId: candidate._id },
          { isPrimary: false }
        );
      }

      // Tạo CV mới
      const newResume = new Resumes({
        candidateId: candidate._id,
        title,
        isPrimary,
        sections: {
          education: [],
          workExperience: [],
          skills: [],
          languages: [],
          projects: [],
          certifications: [],
        },
      });

      await newResume.save();

      res.status(201).json({
        message: "Tạo CV thành công",
        resume: newResume,
      });
    } catch (error) {
      console.error("Lỗi tạo CV:", error);
      res.status(500).json({ message: "Lỗi máy chủ" });
    }
  }

  // Lấy danh sách CV của ứng viên
  async getResumes(req, res) {
    try {
      const userId = req.user.userId;

      // Kiểm tra xem người dùng có phải là ứng viên không
      const authUser = await Auth.findById(userId);
      if (!authUser || authUser.role !== "candidate") {
        return res
          .status(403)
          .json({ message: "Chỉ ứng viên mới có thể xem CV" });
      }

      // Tìm thông tin ứng viên
      const candidate = await Candidates.findOne({ userId });
      if (!candidate) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy thông tin ứng viên" });
      }

      // Lấy danh sách CV
      const resumes = await Resumes.find({ candidateId: candidate._id }).sort({
        isPrimary: -1,
        updatedAt: -1,
      });

      res.json({
        resumes,
        total: resumes.length,
      });
    } catch (error) {
      console.error("Lỗi lấy danh sách CV:", error);
      res.status(500).json({ message: "Lỗi máy chủ" });
    }
  }

  // Lấy chi tiết CV
  async getResumeById(req, res) {
    try {
      const userId = req.user.userId;
      const { resumeId } = req.params;

      // Kiểm tra xem người dùng có phải là ứng viên không
      const authUser = await Auth.findById(userId);
      if (!authUser || authUser.role !== "candidate") {
        return res
          .status(403)
          .json({ message: "Chỉ ứng viên mới có thể xem CV" });
      }

      // Tìm thông tin ứng viên
      const candidate = await Candidates.findOne({ userId });
      if (!candidate) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy thông tin ứng viên" });
      }

      // Lấy chi tiết CV
      const resume = await Resumes.findOne({
        _id: resumeId,
        candidateId: candidate._id,
      });

      if (!resume) {
        return res.status(404).json({ message: "Không tìm thấy CV" });
      }

      res.json({ resume });
    } catch (error) {
      console.error("Lỗi lấy chi tiết CV:", error);
      res.status(500).json({ message: "Lỗi máy chủ" });
    }
  }

  // Cập nhật thông tin cơ bản của CV
  async updateResume(req, res) {
    try {
      const userId = req.user.userId;
      const { resumeId } = req.params;
      const { title, isPrimary } = req.body;

      // Kiểm tra xem người dùng có phải là ứng viên không
      const authUser = await Auth.findById(userId);
      if (!authUser || authUser.role !== "candidate") {
        return res
          .status(403)
          .json({ message: "Chỉ ứng viên mới có thể cập nhật CV" });
      }

      // Tìm thông tin ứng viên
      const candidate = await Candidates.findOne({ userId });
      if (!candidate) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy thông tin ứng viên" });
      }

      // Tìm CV
      const resume = await Resumes.findOne({
        _id: resumeId,
        candidateId: candidate._id,
      });

      if (!resume) {
        return res.status(404).json({ message: "Không tìm thấy CV" });
      }

      // Nếu CV mới là primary, hủy primary của các CV khác
      if (isPrimary && !resume.isPrimary) {
        await Resumes.updateMany(
          { candidateId: candidate._id },
          { isPrimary: false }
        );
      }

      // Cập nhật thông tin
      if (title) resume.title = title;
      if (isPrimary !== undefined) resume.isPrimary = isPrimary;

      await resume.save();

      res.json({
        message: "Cập nhật CV thành công",
        resume,
      });
    } catch (error) {
      console.error("Lỗi cập nhật CV:", error);
      res.status(500).json({ message: "Lỗi máy chủ" });
    }
  }

  // Xóa CV
  async deleteResume(req, res) {
    try {
      const userId = req.user.userId;
      const { resumeId } = req.params;

      // Kiểm tra xem người dùng có phải là ứng viên không
      const authUser = await Auth.findById(userId);
      if (!authUser || authUser.role !== "candidate") {
        return res
          .status(403)
          .json({ message: "Chỉ ứng viên mới có thể xóa CV" });
      }

      // Tìm thông tin ứng viên
      const candidate = await Candidates.findOne({ userId });
      if (!candidate) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy thông tin ứng viên" });
      }

      // Tìm CV
      const resume = await Resumes.findOne({
        _id: resumeId,
        candidateId: candidate._id,
      });

      if (!resume) {
        return res.status(404).json({ message: "Không tìm thấy CV" });
      }

      // Xóa file CV nếu có
      if (resume.fileUrl && fs.existsSync(resume.fileUrl)) {
        fs.unlinkSync(resume.fileUrl);
      }

      // Xóa CV
      await Resumes.findByIdAndDelete(resumeId);

      res.json({ message: "Xóa CV thành công" });
    } catch (error) {
      console.error("Lỗi xóa CV:", error);
      res.status(500).json({ message: "Lỗi máy chủ" });
    }
  }

  // Tải lên CV từ máy tính
  async uploadResumeFile(req, res) {
    try {
      const userId = req.user.userId;
      const { resumeId } = req.params;

      // Kiểm tra xem người dùng có phải là ứng viên không
      const authUser = await Auth.findById(userId);
      if (!authUser || authUser.role !== "candidate") {
        return res
          .status(403)
          .json({ message: "Chỉ ứng viên mới có thể tải lên CV" });
      }

      // Tìm thông tin ứng viên
      const candidate = await Candidates.findOne({ userId });
      if (!candidate) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy thông tin ứng viên" });
      }

      // Tìm CV
      const resume = await Resumes.findOne({
        _id: resumeId,
        candidateId: candidate._id,
      });

      if (!resume) {
        return res.status(404).json({ message: "Không tìm thấy CV" });
      }

      // Kiểm tra file upload
      if (!req.file) {
        return res
          .status(400)
          .json({ message: "Vui lòng chọn file để tải lên" });
      }

      // Xóa file cũ nếu có
      if (resume.fileUrl && fs.existsSync(resume.fileUrl)) {
        fs.unlinkSync(resume.fileUrl);
      }

      // Cập nhật thông tin file
      resume.fileName = req.file.originalname;
      resume.fileUrl = req.file.path;

      await resume.save();

      res.json({
        message: "Tải lên CV thành công",
        fileName: resume.fileName,
        fileUrl: resume.fileUrl,
      });
    } catch (error) {
      console.error("Lỗi tải lên CV:", error);
      res.status(500).json({ message: "Lỗi máy chủ" });
    }
  }

  // Thêm học vấn
  async addEducation(req, res) {
    try {
      const userId = req.user.userId;
      const { resumeId } = req.params;
      const { degree, major, institution, startDate, endDate, description } =
        req.body;

      // Kiểm tra xem người dùng có phải là ứng viên không
      const authUser = await Auth.findById(userId);
      if (!authUser || authUser.role !== "candidate") {
        return res
          .status(403)
          .json({ message: "Chỉ ứng viên mới có thể thêm học vấn" });
      }

      // Tìm thông tin ứng viên
      const candidate = await Candidates.findOne({ userId });
      if (!candidate) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy thông tin ứng viên" });
      }

      // Tìm CV
      const resume = await Resumes.findOne({
        _id: resumeId,
        candidateId: candidate._id,
      });

      if (!resume) {
        return res.status(404).json({ message: "Không tìm thấy CV" });
      }

      // Thêm học vấn mới
      const newEducation = {
        degree,
        major,
        institution,
        startDate,
        endDate,
        description,
      };

      resume.sections.education.push(newEducation);
      await resume.save();

      res.json({
        message: "Thêm học vấn thành công",
        education: newEducation,
      });
    } catch (error) {
      console.error("Lỗi thêm học vấn:", error);
      res.status(500).json({ message: "Lỗi máy chủ" });
    }
  }

  // Cập nhật học vấn
  async updateEducation(req, res) {
    try {
      const userId = req.user.userId;
      const { resumeId, educationId } = req.params;
      const { degree, major, institution, startDate, endDate, description } =
        req.body;

      // Kiểm tra xem người dùng có phải là ứng viên không
      const authUser = await Auth.findById(userId);
      if (!authUser || authUser.role !== "candidate") {
        return res
          .status(403)
          .json({ message: "Chỉ ứng viên mới có thể cập nhật học vấn" });
      }

      // Tìm thông tin ứng viên
      const candidate = await Candidates.findOne({ userId });
      if (!candidate) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy thông tin ứng viên" });
      }

      // Tìm CV và cập nhật học vấn
      const resume = await Resumes.findOne({
        _id: resumeId,
        candidateId: candidate._id,
      });

      if (!resume) {
        return res.status(404).json({ message: "Không tìm thấy CV" });
      }

      const educationIndex = resume.sections.education.findIndex(
        (edu) => edu._id.toString() === educationId
      );

      if (educationIndex === -1) {
        return res.status(404).json({ message: "Không tìm thấy học vấn" });
      }

      // Cập nhật thông tin học vấn
      resume.sections.education[educationIndex] = {
        ...resume.sections.education[educationIndex],
        degree,
        major,
        institution,
        startDate,
        endDate,
        description,
      };

      await resume.save();

      res.json({
        message: "Cập nhật học vấn thành công",
        education: resume.sections.education[educationIndex],
      });
    } catch (error) {
      console.error("Lỗi cập nhật học vấn:", error);
      res.status(500).json({ message: "Lỗi máy chủ" });
    }
  }

  // Xóa học vấn
  async deleteEducation(req, res) {
    try {
      const userId = req.user.userId;
      const { resumeId, educationId } = req.params;

      // Kiểm tra xem người dùng có phải là ứng viên không
      const authUser = await Auth.findById(userId);
      if (!authUser || authUser.role !== "candidate") {
        return res
          .status(403)
          .json({ message: "Chỉ ứng viên mới có thể xóa học vấn" });
      }

      // Tìm thông tin ứng viên
      const candidate = await Candidates.findOne({ userId });
      if (!candidate) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy thông tin ứng viên" });
      }

      // Tìm CV và xóa học vấn
      const resume = await Resumes.findOne({
        _id: resumeId,
        candidateId: candidate._id,
      });

      if (!resume) {
        return res.status(404).json({ message: "Không tìm thấy CV" });
      }

      resume.sections.education = resume.sections.education.filter(
        (edu) => edu._id.toString() !== educationId
      );

      await resume.save();

      res.json({ message: "Xóa học vấn thành công" });
    } catch (error) {
      console.error("Lỗi xóa học vấn:", error);
      res.status(500).json({ message: "Lỗi máy chủ" });
    }
  }

  // Thêm kinh nghiệm làm việc
  async addWorkExperience(req, res) {
    try {
      const userId = req.user.userId;
      const { resumeId } = req.params;
      const { jobTitle, companyName, startDate, endDate, description } =
        req.body;

      // Kiểm tra xem người dùng có phải là ứng viên không
      const authUser = await Auth.findById(userId);
      if (!authUser || authUser.role !== "candidate") {
        return res.status(403).json({
          message: "Chỉ ứng viên mới có thể thêm kinh nghiệm làm việc",
        });
      }

      // Tìm thông tin ứng viên
      const candidate = await Candidates.findOne({ userId });
      if (!candidate) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy thông tin ứng viên" });
      }

      // Tìm CV
      const resume = await Resumes.findOne({
        _id: resumeId,
        candidateId: candidate._id,
      });

      if (!resume) {
        return res.status(404).json({ message: "Không tìm thấy CV" });
      }

      // Thêm kinh nghiệm làm việc mới
      const newWorkExperience = {
        jobTitle,
        companyName,
        startDate,
        endDate,
        description,
      };

      resume.sections.workExperience.push(newWorkExperience);
      await resume.save();

      res.json({
        message: "Thêm kinh nghiệm làm việc thành công",
        workExperience: newWorkExperience,
      });
    } catch (error) {
      console.error("Lỗi thêm kinh nghiệm làm việc:", error);
      res.status(500).json({ message: "Lỗi máy chủ" });
    }
  }

  // Cập nhật kinh nghiệm làm việc
  async updateWorkExperience(req, res) {
    try {
      const userId = req.user.userId;
      const { resumeId, experienceId } = req.params;
      const { jobTitle, companyName, startDate, endDate, description } =
        req.body;

      // Kiểm tra xem người dùng có phải là ứng viên không
      const authUser = await Auth.findById(userId);
      if (!authUser || authUser.role !== "candidate") {
        return res.status(403).json({
          message: "Chỉ ứng viên mới có thể cập nhật kinh nghiệm làm việc",
        });
      }

      // Tìm thông tin ứng viên
      const candidate = await Candidates.findOne({ userId });
      if (!candidate) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy thông tin ứng viên" });
      }

      // Tìm CV và cập nhật kinh nghiệm làm việc
      const resume = await Resumes.findOne({
        _id: resumeId,
        candidateId: candidate._id,
      });

      if (!resume) {
        return res.status(404).json({ message: "Không tìm thấy CV" });
      }

      const experienceIndex = resume.sections.workExperience.findIndex(
        (exp) => exp._id.toString() === experienceId
      );

      if (experienceIndex === -1) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy kinh nghiệm làm việc" });
      }

      // Cập nhật thông tin kinh nghiệm làm việc
      resume.sections.workExperience[experienceIndex] = {
        ...resume.sections.workExperience[experienceIndex],
        jobTitle,
        companyName,
        startDate,
        endDate,
        description,
      };

      await resume.save();

      res.json({
        message: "Cập nhật kinh nghiệm làm việc thành công",
        workExperience: resume.sections.workExperience[experienceIndex],
      });
    } catch (error) {
      console.error("Lỗi cập nhật kinh nghiệm làm việc:", error);
      res.status(500).json({ message: "Lỗi máy chủ" });
    }
  }

  // Xóa kinh nghiệm làm việc
  async deleteWorkExperience(req, res) {
    try {
      const userId = req.user.userId;
      const { resumeId, experienceId } = req.params;

      // Kiểm tra xem người dùng có phải là ứng viên không
      const authUser = await Auth.findById(userId);
      if (!authUser || authUser.role !== "candidate") {
        return res.status(403).json({
          message: "Chỉ ứng viên mới có thể xóa kinh nghiệm làm việc",
        });
      }

      // Tìm thông tin ứng viên
      const candidate = await Candidates.findOne({ userId });
      if (!candidate) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy thông tin ứng viên" });
      }

      // Tìm CV và xóa kinh nghiệm làm việc
      const resume = await Resumes.findOne({
        _id: resumeId,
        candidateId: candidate._id,
      });

      if (!resume) {
        return res.status(404).json({ message: "Không tìm thấy CV" });
      }

      resume.sections.workExperience = resume.sections.workExperience.filter(
        (exp) => exp._id.toString() !== experienceId
      );

      await resume.save();

      res.json({ message: "Xóa kinh nghiệm làm việc thành công" });
    } catch (error) {
      console.error("Lỗi xóa kinh nghiệm làm việc:", error);
      res.status(500).json({ message: "Lỗi máy chủ" });
    }
  }

  // Thêm kỹ năng
  async addSkill(req, res) {
    try {
      const userId = req.user.userId;
      const { resumeId } = req.params;
      const { name, level } = req.body;

      // Kiểm tra xem người dùng có phải là ứng viên không
      const authUser = await Auth.findById(userId);
      if (!authUser || authUser.role !== "candidate") {
        return res
          .status(403)
          .json({ message: "Chỉ ứng viên mới có thể thêm kỹ năng" });
      }

      // Tìm thông tin ứng viên
      const candidate = await Candidates.findOne({ userId });
      if (!candidate) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy thông tin ứng viên" });
      }

      // Tìm CV
      const resume = await Resumes.findOne({
        _id: resumeId,
        candidateId: candidate._id,
      });

      if (!resume) {
        return res.status(404).json({ message: "Không tìm thấy CV" });
      }

      // Kiểm tra kỹ năng đã tồn tại chưa
      const existingSkill = resume.sections.skills.find(
        (skill) => skill.name.toLowerCase() === name.toLowerCase()
      );

      if (existingSkill) {
        return res.status(400).json({ message: "Kỹ năng này đã tồn tại" });
      }

      // Thêm kỹ năng mới
      const newSkill = { name, level };
      resume.sections.skills.push(newSkill);
      await resume.save();

      res.json({
        message: "Thêm kỹ năng thành công",
        skill: newSkill,
      });
    } catch (error) {
      console.error("Lỗi thêm kỹ năng:", error);
      res.status(500).json({ message: "Lỗi máy chủ" });
    }
  }

  // Cập nhật kỹ năng
  async updateSkill(req, res) {
    try {
      const userId = req.user.userId;
      const { resumeId, skillId } = req.params;
      const { name, level } = req.body;

      // Kiểm tra xem người dùng có phải là ứng viên không
      const authUser = await Auth.findById(userId);
      if (!authUser || authUser.role !== "candidate") {
        return res
          .status(403)
          .json({ message: "Chỉ ứng viên mới có thể cập nhật kỹ năng" });
      }

      // Tìm thông tin ứng viên
      const candidate = await Candidates.findOne({ userId });
      if (!candidate) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy thông tin ứng viên" });
      }

      // Tìm CV và cập nhật kỹ năng
      const resume = await Resumes.findOne({
        _id: resumeId,
        candidateId: candidate._id,
      });

      if (!resume) {
        return res.status(404).json({ message: "Không tìm thấy CV" });
      }

      const skillIndex = resume.sections.skills.findIndex(
        (skill) => skill._id.toString() === skillId
      );

      if (skillIndex === -1) {
        return res.status(404).json({ message: "Không tìm thấy kỹ năng" });
      }

      // Cập nhật thông tin kỹ năng
      resume.sections.skills[skillIndex] = {
        ...resume.sections.skills[skillIndex],
        name,
        level,
      };

      await resume.save();

      res.json({
        message: "Cập nhật kỹ năng thành công",
        skill: resume.sections.skills[skillIndex],
      });
    } catch (error) {
      console.error("Lỗi cập nhật kỹ năng:", error);
      res.status(500).json({ message: "Lỗi máy chủ" });
    }
  }

  // Xóa kỹ năng
  async deleteSkill(req, res) {
    try {
      const userId = req.user.userId;
      const { resumeId, skillId } = req.params;

      // Kiểm tra xem người dùng có phải là ứng viên không
      const authUser = await Auth.findById(userId);
      if (!authUser || authUser.role !== "candidate") {
        return res
          .status(403)
          .json({ message: "Chỉ ứng viên mới có thể xóa kỹ năng" });
      }

      // Tìm thông tin ứng viên
      const candidate = await Candidates.findOne({ userId });
      if (!candidate) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy thông tin ứng viên" });
      }

      // Tìm CV và xóa kỹ năng
      const resume = await Resumes.findOne({
        _id: resumeId,
        candidateId: candidate._id,
      });

      if (!resume) {
        return res.status(404).json({ message: "Không tìm thấy CV" });
      }

      resume.sections.skills = resume.sections.skills.filter(
        (skill) => skill._id.toString() !== skillId
      );

      await resume.save();

      res.json({ message: "Xóa kỹ năng thành công" });
    } catch (error) {
      console.error("Lỗi xóa kỹ năng:", error);
      res.status(500).json({ message: "Lỗi máy chủ" });
    }
  }

  // Thêm ngoại ngữ
  async addLanguage(req, res) {
    try {
      const userId = req.user.userId;
      const { resumeId } = req.params;
      const { name, proficiency } = req.body;

      // Kiểm tra xem người dùng có phải là ứng viên không
      const authUser = await Auth.findById(userId);
      if (!authUser || authUser.role !== "candidate") {
        return res
          .status(403)
          .json({ message: "Chỉ ứng viên mới có thể thêm ngoại ngữ" });
      }

      // Tìm thông tin ứng viên
      const candidate = await Candidates.findOne({ userId });
      if (!candidate) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy thông tin ứng viên" });
      }

      // Tìm CV
      const resume = await Resumes.findOne({
        _id: resumeId,
        candidateId: candidate._id,
      });

      if (!resume) {
        return res.status(404).json({ message: "Không tìm thấy CV" });
      }

      // Kiểm tra ngoại ngữ đã tồn tại chưa
      const existingLanguage = resume.sections.languages.find(
        (lang) => lang.name.toLowerCase() === name.toLowerCase()
      );

      if (existingLanguage) {
        return res.status(400).json({ message: "Ngoại ngữ này đã tồn tại" });
      }

      // Thêm ngoại ngữ mới
      const newLanguage = { name, proficiency };
      resume.sections.languages.push(newLanguage);
      await resume.save();

      res.json({
        message: "Thêm ngoại ngữ thành công",
        language: newLanguage,
      });
    } catch (error) {
      console.error("Lỗi thêm ngoại ngữ:", error);
      res.status(500).json({ message: "Lỗi máy chủ" });
    }
  }

  // Cập nhật ngoại ngữ
  async updateLanguage(req, res) {
    try {
      const userId = req.user.userId;
      const { resumeId, languageId } = req.params;
      const { name, proficiency } = req.body;

      // Kiểm tra xem người dùng có phải là ứng viên không
      const authUser = await Auth.findById(userId);
      if (!authUser || authUser.role !== "candidate") {
        return res
          .status(403)
          .json({ message: "Chỉ ứng viên mới có thể cập nhật ngoại ngữ" });
      }

      // Tìm thông tin ứng viên
      const candidate = await Candidates.findOne({ userId });
      if (!candidate) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy thông tin ứng viên" });
      }

      // Tìm CV và cập nhật ngoại ngữ
      const resume = await Resumes.findOne({
        _id: resumeId,
        candidateId: candidate._id,
      });

      if (!resume) {
        return res.status(404).json({ message: "Không tìm thấy CV" });
      }

      const languageIndex = resume.sections.languages.findIndex(
        (lang) => lang._id.toString() === languageId
      );

      if (languageIndex === -1) {
        return res.status(404).json({ message: "Không tìm thấy ngoại ngữ" });
      }

      // Cập nhật thông tin ngoại ngữ
      resume.sections.languages[languageIndex] = {
        ...resume.sections.languages[languageIndex],
        name,
        proficiency,
      };

      await resume.save();

      res.json({
        message: "Cập nhật ngoại ngữ thành công",
        language: resume.sections.languages[languageIndex],
      });
    } catch (error) {
      console.error("Lỗi cập nhật ngoại ngữ:", error);
      res.status(500).json({ message: "Lỗi máy chủ" });
    }
  }

  // Xóa ngoại ngữ
  async deleteLanguage(req, res) {
    try {
      const userId = req.user.userId;
      const { resumeId, languageId } = req.params;

      // Kiểm tra xem người dùng có phải là ứng viên không
      const authUser = await Auth.findById(userId);
      if (!authUser || authUser.role !== "candidate") {
        return res
          .status(403)
          .json({ message: "Chỉ ứng viên mới có thể xóa ngoại ngữ" });
      }

      // Tìm thông tin ứng viên
      const candidate = await Candidates.findOne({ userId });
      if (!candidate) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy thông tin ứng viên" });
      }

      // Tìm CV và xóa ngoại ngữ
      const resume = await Resumes.findOne({
        _id: resumeId,
        candidateId: candidate._id,
      });

      if (!resume) {
        return res.status(404).json({ message: "Không tìm thấy CV" });
      }

      resume.sections.languages = resume.sections.languages.filter(
        (lang) => lang._id.toString() !== languageId
      );

      await resume.save();

      res.json({ message: "Xóa ngoại ngữ thành công" });
    } catch (error) {
      console.error("Lỗi xóa ngoại ngữ:", error);
      res.status(500).json({ message: "Lỗi máy chủ" });
    }
  }

  // Thêm chứng chỉ/bằng cấp
  async addCertification(req, res) {
    try {
      const userId = req.user.userId;
      const { resumeId } = req.params;
      const {
        name,
        issuingOrganization,
        issueDate,
        expirationDate,
        credentialId,
        credentialUrl,
      } = req.body;

      // Kiểm tra xem người dùng có phải là ứng viên không
      const authUser = await Auth.findById(userId);
      if (!authUser || authUser.role !== "candidate") {
        return res
          .status(403)
          .json({ message: "Chỉ ứng viên mới có thể thêm chứng chỉ" });
      }

      // Tìm thông tin ứng viên
      const candidate = await Candidates.findOne({ userId });
      if (!candidate) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy thông tin ứng viên" });
      }

      // Tìm CV
      const resume = await Resumes.findOne({
        _id: resumeId,
        candidateId: candidate._id,
      });

      if (!resume) {
        return res.status(404).json({ message: "Không tìm thấy CV" });
      }

      // Thêm chứng chỉ mới
      const newCertification = {
        name,
        issuingOrganization,
        issueDate,
        expirationDate,
        credentialId,
        credentialUrl,
      };

      resume.sections.certifications.push(newCertification);
      await resume.save();

      res.json({
        message: "Thêm chứng chỉ thành công",
        certification: newCertification,
      });
    } catch (error) {
      console.error("Lỗi thêm chứng chỉ:", error);
      res.status(500).json({ message: "Lỗi máy chủ" });
    }
  }

  // Cập nhật chứng chỉ
  async updateCertification(req, res) {
    try {
      const userId = req.user.userId;
      const { resumeId, certificationId } = req.params;
      const {
        name,
        issuingOrganization,
        issueDate,
        expirationDate,
        credentialId,
        credentialUrl,
      } = req.body;

      // Kiểm tra xem người dùng có phải là ứng viên không
      const authUser = await Auth.findById(userId);
      if (!authUser || authUser.role !== "candidate") {
        return res
          .status(403)
          .json({ message: "Chỉ ứng viên mới có thể cập nhật chứng chỉ" });
      }

      // Tìm thông tin ứng viên
      const candidate = await Candidates.findOne({ userId });
      if (!candidate) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy thông tin ứng viên" });
      }

      // Tìm CV và cập nhật chứng chỉ
      const resume = await Resumes.findOne({
        _id: resumeId,
        candidateId: candidate._id,
      });

      if (!resume) {
        return res.status(404).json({ message: "Không tìm thấy CV" });
      }

      const certificationIndex = resume.sections.certifications.findIndex(
        (cert) => cert._id.toString() === certificationId
      );

      if (certificationIndex === -1) {
        return res.status(404).json({ message: "Không tìm thấy chứng chỉ" });
      }

      // Cập nhật thông tin chứng chỉ
      resume.sections.certifications[certificationIndex] = {
        ...resume.sections.certifications[certificationIndex],
        name,
        issuingOrganization,
        issueDate,
        expirationDate,
        credentialId,
        credentialUrl,
      };

      await resume.save();

      res.json({
        message: "Cập nhật chứng chỉ thành công",
        certification: resume.sections.certifications[certificationIndex],
      });
    } catch (error) {
      console.error("Lỗi cập nhật chứng chỉ:", error);
      res.status(500).json({ message: "Lỗi máy chủ" });
    }
  }

  // Xóa chứng chỉ
  async deleteCertification(req, res) {
    try {
      const userId = req.user.userId;
      const { resumeId, certificationId } = req.params;

      // Kiểm tra xem người dùng có phải là ứng viên không
      const authUser = await Auth.findById(userId);
      if (!authUser || authUser.role !== "candidate") {
        return res
          .status(403)
          .json({ message: "Chỉ ứng viên mới có thể xóa chứng chỉ" });
      }

      // Tìm thông tin ứng viên
      const candidate = await Candidates.findOne({ userId });
      if (!candidate) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy thông tin ứng viên" });
      }

      // Tìm CV và xóa chứng chỉ
      const resume = await Resumes.findOne({
        _id: resumeId,
        candidateId: candidate._id,
      });

      if (!resume) {
        return res.status(404).json({ message: "Không tìm thấy CV" });
      }

      resume.sections.certifications = resume.sections.certifications.filter(
        (cert) => cert._id.toString() !== certificationId
      );

      await resume.save();

      res.json({ message: "Xóa chứng chỉ thành công" });
    } catch (error) {
      console.error("Lỗi xóa chứng chỉ:", error);
      res.status(500).json({ message: "Lỗi máy chủ" });
    }
  }

  // Thêm dự án/thành tựu
  async addProject(req, res) {
    try {
      const userId = req.user.userId;
      const { resumeId } = req.params;
      const { name, description, startDate, endDate, projectUrl } = req.body;

      // Kiểm tra xem người dùng có phải là ứng viên không
      const authUser = await Auth.findById(userId);
      if (!authUser || authUser.role !== "candidate") {
        return res
          .status(403)
          .json({ message: "Chỉ ứng viên mới có thể thêm dự án" });
      }

      // Tìm thông tin ứng viên
      const candidate = await Candidates.findOne({ userId });
      if (!candidate) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy thông tin ứng viên" });
      }

      // Tìm CV
      const resume = await Resumes.findOne({
        _id: resumeId,
        candidateId: candidate._id,
      });

      if (!resume) {
        return res.status(404).json({ message: "Không tìm thấy CV" });
      }

      // Thêm dự án mới
      const newProject = {
        name,
        description,
        startDate,
        endDate,
        projectUrl,
      };

      resume.sections.projects.push(newProject);
      await resume.save();

      res.json({
        message: "Thêm dự án thành công",
        project: newProject,
      });
    } catch (error) {
      console.error("Lỗi thêm dự án:", error);
      res.status(500).json({ message: "Lỗi máy chủ" });
    }
  }

  // Cập nhật dự án
  async updateProject(req, res) {
    try {
      const userId = req.user.userId;
      const { resumeId, projectId } = req.params;
      const { name, description, startDate, endDate, projectUrl } = req.body;

      // Kiểm tra xem người dùng có phải là ứng viên không
      const authUser = await Auth.findById(userId);
      if (!authUser || authUser.role !== "candidate") {
        return res
          .status(403)
          .json({ message: "Chỉ ứng viên mới có thể cập nhật dự án" });
      }

      // Tìm thông tin ứng viên
      const candidate = await Candidates.findOne({ userId });
      if (!candidate) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy thông tin ứng viên" });
      }

      // Tìm CV và cập nhật dự án
      const resume = await Resumes.findOne({
        _id: resumeId,
        candidateId: candidate._id,
      });

      if (!resume) {
        return res.status(404).json({ message: "Không tìm thấy CV" });
      }

      const projectIndex = resume.sections.projects.findIndex(
        (proj) => proj._id.toString() === projectId
      );

      if (projectIndex === -1) {
        return res.status(404).json({ message: "Không tìm thấy dự án" });
      }

      // Cập nhật thông tin dự án
      resume.sections.projects[projectIndex] = {
        ...resume.sections.projects[projectIndex],
        name,
        description,
        startDate,
        endDate,
        projectUrl,
      };

      await resume.save();

      res.json({
        message: "Cập nhật dự án thành công",
        project: resume.sections.projects[projectIndex],
      });
    } catch (error) {
      console.error("Lỗi cập nhật dự án:", error);
      res.status(500).json({ message: "Lỗi máy chủ" });
    }
  }

  // Xóa dự án
  async deleteProject(req, res) {
    try {
      const userId = req.user.userId;
      const { resumeId, projectId } = req.params;

      // Kiểm tra xem người dùng có phải là ứng viên không
      const authUser = await Auth.findById(userId);
      if (!authUser || authUser.role !== "candidate") {
        return res
          .status(403)
          .json({ message: "Chỉ ứng viên mới có thể xóa dự án" });
      }

      // Tìm thông tin ứng viên
      const candidate = await Candidates.findOne({ userId });
      if (!candidate) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy thông tin ứng viên" });
      }

      // Tìm CV và xóa dự án
      const resume = await Resumes.findOne({
        _id: resumeId,
        candidateId: candidate._id,
      });

      if (!resume) {
        return res.status(404).json({ message: "Không tìm thấy CV" });
      }

      resume.sections.projects = resume.sections.projects.filter(
        (proj) => proj._id.toString() !== projectId
      );

      await resume.save();

      res.json({ message: "Xóa dự án thành công" });
    } catch (error) {
      console.error("Lỗi xóa dự án:", error);
      res.status(500).json({ message: "Lỗi máy chủ" });
    }
  }
}

module.exports = new CVController();
