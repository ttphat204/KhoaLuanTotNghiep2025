const mongoose = require("mongoose");

const employerSchema = new mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, ref: "Auth" },
    companyName: {
      type: String,
      required: [true, "Tên công ty là bắt buộc"],
      trim: true,
    },
    companyEmail: {
      type: String,
      required: [true, "Email công ty là bắt buộc"],
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Email không hợp lệ",
      ],
    },
    companyPhoneNumber: {
      type: String,
      required: [true, "Số điện thoại công ty là bắt buộc"],
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    district: {
      type: String,
      trim: true,
    },
    ward: {
      type: String,
      trim: true,
    },
    companyAddress: {
      type: String,
      trim: true,
    },
    companyWebsite: {
      type: String,
      trim: true,
    },
    companyDescription: {
      type: String,
      trim: true,
    },
    companyLogoUrl: {
      type: String,
      trim: true,
    },
    industry: {
      type: String,
      trim: true,
    },
    companySize: {
      type: String,
      min: [1, "Quy mô công ty phải lớn hơn 0"],
    },
    foundedYear: {
      type: String,
      min: [1900, "Năm thành lập không hợp lệ"],
      max: [new Date().getFullYear(), "Năm thành lập không hợp lệ"],
    },
    status: { type: String, default: "inactive" },
    rejectReason: String,
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
// employerSchema.index({ userId: 1 }); // Đã unique ở schema, không cần dòng này
employerSchema.index({ companyName: "text" });
employerSchema.index({ industry: 1 });
employerSchema.index({ companySize: 1 });

module.exports = mongoose.model("Employer", employerSchema);
