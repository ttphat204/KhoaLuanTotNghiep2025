const mongoose = require("mongoose");

const employerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "UserId là bắt buộc"],
      unique: true,
    },
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
    companyAddress: {
      type: String,
      required: [true, "Địa chỉ công ty là bắt buộc"],
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
      required: [true, "Ngành nghề là bắt buộc"],
      trim: true,
    },
    companySize: {
  type: Number,
  required: [true, "Quy mô công ty là bắt buộc"],
  min: [1, "Quy mô công ty phải lớn hơn 0"],
},
    foundedYear: {
      type: Number,
      min: [1900, "Năm thành lập không hợp lệ"],
      max: [new Date().getFullYear(), "Năm thành lập không hợp lệ"],
    },
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
