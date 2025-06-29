const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    employerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employer",
      required: [true, "EmployerId là bắt buộc"],
    },
    reportType: {
      type: String,
      required: [true, "Loại báo cáo là bắt buộc"],
      enum: {
        values: [
          "JobPerformance",
          "ApplicantDemographics",
          "InterviewStatistics",
          "ApplicationStatus",
        ],
        message: "Loại báo cáo không hợp lệ",
      },
    },
    data: {
      type: Object,
      required: [true, "Dữ liệu báo cáo là bắt buộc"],
    },
    generatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
reportSchema.index({ employerId: 1, reportType: 1 });
reportSchema.index({ generatedAt: -1 });

module.exports = mongoose.model("Report", reportSchema);
