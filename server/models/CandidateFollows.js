const mongoose = require("mongoose");

const candidateFollowSchema = new mongoose.Schema(
  {
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Candidate",
      required: [true, "CandidateId là bắt buộc"],
    },
    employerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employer",
      required: [true, "EmployerId là bắt buộc"],
    },
    followedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index để đảm bảo một nhà tuyển dụng không thể theo dõi cùng một ứng viên nhiều lần
candidateFollowSchema.index(
  { candidateId: 1, employerId: 1 },
  { unique: true }
);
candidateFollowSchema.index({ followedAt: -1 });

module.exports = mongoose.model("CandidateFollow", candidateFollowSchema);
