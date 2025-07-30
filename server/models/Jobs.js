const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    employerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
      required: true,
    },
    jobTitle: {
      type: String,
      required: [true, "Tiêu đề công việc là bắt buộc"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Mô tả công việc là bắt buộc"],
      trim: true,
    },
    requirements: [
      {
        type: String,
        trim: true,
      },
    ],
    jobRequirements: {
      type: String,
      required: [true, "Yêu cầu công việc là bắt buộc"],
      trim: true,
    },
    benefits: [
      {
        type: String,
        trim: true,
      },
    ],
    salaryRange: {
      min: {
        type: Number,
        required: [true, "Mức lương tối thiểu là bắt buộc"],
      },
      max: {
        type: Number,
        required: [true, "Mức lương tối đa là bắt buộc"],
      },
      currency: {
        type: String,
        default: "VND",
      },
    },
    location: {
      province: {
        type: String,
        required: [true, "Tỉnh/Thành phố là bắt buộc"],
        trim: true,
      },
      district: {
        type: String,
        trim: true,
      },
      addressDetail: {
        type: String,
        trim: true,
      },
    },
    jobType: {
      type: String,
      required: [true, "Loại hình công việc là bắt buộc"],
      enum: {
        values: ["Full-time", "Part-time", "Remote", "Internship", "Contract"],
        message: "Loại hình công việc không hợp lệ",
      },
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Danh mục công việc là bắt buộc"],
    },
    skillsRequired: [
      {
        type: String,
        trim: true,
      },
    ],
    experienceLevel: {
      type: String,
      required: [true, "Cấp độ kinh nghiệm là bắt buộc"],
      trim: true,
    },
    quantity: {
      type: Number,
      required: [true, "Số lượng tuyển dụng là bắt buộc"],
      min: [1, "Số lượng tuyển dụng phải lớn hơn 0"],
      default: 1,
    },
    level: {
      type: String,
      required: [true, "Cấp bậc công việc là bắt buộc"],
      trim: true,
    },
    applicationDeadline: {
      type: Date,
      required: [true, "Hạn nộp hồ sơ là bắt buộc"],
    },
    postedDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      required: [true, "Trạng thái là bắt buộc"],
      enum: {
        values: ["Active", "Closed", "Draft", "Archived"],
        message: "Trạng thái không hợp lệ",
      },
      default: "Active",
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
    applicantsCount: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
jobSchema.index({ employerId: 1 });
jobSchema.index({ categoryId: 1 });
jobSchema.index({ jobTitle: "text" });
jobSchema.index({ location: "text" });
jobSchema.index({ skillsRequired: 1 });
jobSchema.index({ status: 1, postedDate: -1 });
jobSchema.index({ isFeatured: 1, postedDate: -1 });

module.exports = mongoose.model("Job", jobSchema);
