const mongoose = require("mongoose");

const jobReportSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: [true, "JobId là bắt buộc"],
    },
    reporterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "ReporterId là bắt buộc"],
    },
    reason: {
      type: String,
      required: [true, "Lý do báo cáo là bắt buộc"],
      trim: true,
    },
    reportedAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      required: [true, "Trạng thái là bắt buộc"],
      enum: {
        values: ["Pending", "Resolved", "Ignored"],
        message: "Trạng thái không hợp lệ",
      },
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
jobReportSchema.index({ jobId: 1 });
jobReportSchema.index({ reporterId: 1 });
jobReportSchema.index({ status: 1 });
jobReportSchema.index({ reportedAt: -1 });

module.exports = mongoose.model("JobReport", jobReportSchema);
