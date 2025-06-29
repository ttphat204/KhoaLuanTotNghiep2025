const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Candidate",
      required: [true, "CandidateId là bắt buộc"],
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: [true, "JobId là bắt buộc"],
    },
    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
      required: [true, "ResumeId là bắt buộc"],
    },
    applicationDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      required: [true, "Trạng thái là bắt buộc"],
      enum: {
        values: [
          "Pending",
          "Reviewed",
          "Interviewing",
          "Offer",
          "Rejected",
          "Hired",
        ],
        message: "Trạng thái không hợp lệ",
      },
      default: "Pending",
    },
    coverLetter: {
      type: String,
      trim: true,
    },
    note: {
      type: String,
      trim: true,
    },
    lastStatusUpdate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
applicationSchema.index({ candidateId: 1, jobId: 1 }, { unique: true });
applicationSchema.index({ jobId: 1, status: 1 });
applicationSchema.index({ applicationDate: -1 });
applicationSchema.index({ lastStatusUpdate: -1 });

module.exports = mongoose.model("Application", applicationSchema);
