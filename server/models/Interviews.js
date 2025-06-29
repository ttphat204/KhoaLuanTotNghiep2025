const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema(
  {
    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
      required: [true, "ApplicationId là bắt buộc"],
    },
    employerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employer",
      required: [true, "EmployerId là bắt buộc"],
    },
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Candidate",
      required: [true, "CandidateId là bắt buộc"],
    },
    interviewDate: {
      type: Date,
      required: [true, "Ngày phỏng vấn là bắt buộc"],
    },
    interviewTime: {
      type: String,
      required: [true, "Thời gian phỏng vấn là bắt buộc"],
      match: [
        /^([0-1]?[0-9]|2[0-3]):[0-5][0-9] (AM|PM)$/,
        "Định dạng thời gian không hợp lệ",
      ],
    },
    interviewType: {
      type: String,
      required: [true, "Hình thức phỏng vấn là bắt buộc"],
      enum: {
        values: ["Online", "On-site", "Phone"],
        message: "Hình thức phỏng vấn không hợp lệ",
      },
    },
    interviewLocation: {
      type: String,
      required: [true, "Địa điểm phỏng vấn là bắt buộc"],
      trim: true,
    },
    interviewerNames: [
      {
        type: String,
        trim: true,
      },
    ],
    status: {
      type: String,
      required: [true, "Trạng thái là bắt buộc"],
      enum: {
        values: ["Scheduled", "Completed", "Cancelled", "Rescheduled"],
        message: "Trạng thái không hợp lệ",
      },
      default: "Scheduled",
    },
    feedback: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
interviewSchema.index({ applicationId: 1 });
interviewSchema.index({ employerId: 1 });
interviewSchema.index({ candidateId: 1 });
interviewSchema.index({ interviewDate: 1 });
interviewSchema.index({ status: 1 });

module.exports = mongoose.model("Interview", interviewSchema);
