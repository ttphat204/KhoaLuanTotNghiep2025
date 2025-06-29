const mongoose = require("mongoose");

const favoriteJobSchema = new mongoose.Schema(
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
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index để đảm bảo một ứng viên không thể lưu cùng một công việc nhiều lần
favoriteJobSchema.index({ candidateId: 1, jobId: 1 }, { unique: true });
favoriteJobSchema.index({ createdAt: -1 });

module.exports = mongoose.model("FavoriteJob", favoriteJobSchema);
