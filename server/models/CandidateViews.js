const mongoose = require("mongoose");

const candidateViewSchema = new mongoose.Schema(
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
    viewedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
candidateViewSchema.index({ candidateId: 1, employerId: 1 });
candidateViewSchema.index({ viewedAt: -1 });

module.exports = mongoose.model("CandidateView", candidateViewSchema);
