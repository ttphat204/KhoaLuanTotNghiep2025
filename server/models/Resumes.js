const mongoose = require("mongoose");

const educationSchema = new mongoose.Schema({
  degree: {
    type: String,
    required: [true, "Bằng cấp là bắt buộc"],
    trim: true,
  },
  major: {
    type: String,
    required: [true, "Chuyên ngành là bắt buộc"],
    trim: true,
  },
  institution: {
    type: String,
    required: [true, "Trường học là bắt buộc"],
    trim: true,
  },
  startDate: {
    type: Date,
    required: [true, "Ngày bắt đầu là bắt buộc"],
  },
  endDate: Date,
  description: String,
});

const workExperienceSchema = new mongoose.Schema({
  jobTitle: {
    type: String,
    required: [true, "Chức danh là bắt buộc"],
    trim: true,
  },
  companyName: {
    type: String,
    required: [true, "Tên công ty là bắt buộc"],
    trim: true,
  },
  startDate: {
    type: Date,
    required: [true, "Ngày bắt đầu là bắt buộc"],
  },
  endDate: Date,
  description: String,
});

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Tên kỹ năng là bắt buộc"],
    trim: true,
  },
  level: {
    type: String,
    required: [true, "Cấp độ là bắt buộc"],
    enum: {
      values: ["Beginner", "Intermediate", "Advanced", "Expert"],
      message: "Cấp độ không hợp lệ",
    },
  },
});

const languageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Tên ngôn ngữ là bắt buộc"],
    trim: true,
  },
  proficiency: {
    type: String,
    required: [true, "Trình độ là bắt buộc"],
    enum: {
      values: ["Native", "Fluent", "Advanced", "Intermediate", "Basic"],
      message: "Trình độ không hợp lệ",
    },
  },
});

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Tên dự án là bắt buộc"],
    trim: true,
  },
  description: String,
  startDate: Date,
  endDate: Date,
  projectUrl: String,
});

const certificationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Tên chứng chỉ là bắt buộc"],
    trim: true,
  },
  issuingOrganization: {
    type: String,
    required: [true, "Tổ chức cấp là bắt buộc"],
    trim: true,
  },
  issueDate: {
    type: Date,
    required: [true, "Ngày cấp là bắt buộc"],
  },
  expirationDate: Date,
  credentialId: String,
  credentialUrl: String,
});

const resumeSchema = new mongoose.Schema(
  {
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Candidate",
      required: [true, "CandidateId là bắt buộc"],
    },
    title: {
      type: String,
      required: [true, "Tiêu đề CV là bắt buộc"],
      trim: true,
    },
    fileName: {
      type: String,
      trim: true,
    },
    fileUrl: {
      type: String,
      trim: true,
    },
    isPrimary: {
      type: Boolean,
      default: false,
    },
    lastUsed: Date,
    sections: {
      education: [educationSchema],
      workExperience: [workExperienceSchema],
      skills: [skillSchema],
      languages: [languageSchema],
      projects: [projectSchema],
      certifications: [certificationSchema],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
resumeSchema.index({ candidateId: 1 });
resumeSchema.index({ title: "text" });
resumeSchema.index({ "sections.skills.name": "text" });

module.exports = mongoose.model("Resume", resumeSchema);
