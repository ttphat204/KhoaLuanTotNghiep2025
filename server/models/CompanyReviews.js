const mongoose = require("mongoose");

const companyReviewSchema = new mongoose.Schema(
  {
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Candidate",
      required: [true, "CandidateId là bắt buộc"],
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employer",
      required: [true, "CompanyId là bắt buộc"],
    },
    rating: {
      type: Number,
      required: [true, "Đánh giá là bắt buộc"],
      min: [1, "Đánh giá tối thiểu là 1"],
      max: [5, "Đánh giá tối đa là 5"],
    },
    title: {
      type: String,
      required: [true, "Tiêu đề là bắt buộc"],
      trim: true,
    },
    reviewText: {
      type: String,
      required: [true, "Nội dung đánh giá là bắt buộc"],
      trim: true,
    },
    anonymous: {
      type: Boolean,
      default: false,
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

// Indexes
companyReviewSchema.index({ companyId: 1, createdAt: -1 });
companyReviewSchema.index({ candidateId: 1, companyId: 1 }, { unique: true });
companyReviewSchema.index({ rating: 1 });

module.exports = mongoose.model("CompanyReview", companyReviewSchema);
