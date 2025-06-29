const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const authSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["admin", "candidate", "employer"],
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Email không hợp lệ",
      ],
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: [8, "Mật khẩu phải có ít nhất 8 ký tự"],
      select: false, // Không trả về password khi query
    },
    fullName: {
      type: String,
      required: function () {
        return this.role === "candidate" || this.role === "admin";
      },
      trim: true,
    },
    companyName: {
      type: String,
      required: function () {
        return this.role === "employer";
      },
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: function () {
        return this.role === "candidate";
      },
    },
    dateOfBirth: {
      type: Date,
      required: function () {
        return this.role === "candidate";
      },
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
    },
    lastLogin: {
      type: Date,
    },
    loginAttempts: {
      type: Number,
      default: 0,
    },
    lockUntil: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Middleware để mã hóa mật khẩu trước khi lưu
authSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method để so sánh mật khẩu
authSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

// Indexes
authSchema.index({ email: 1 });
authSchema.index({ phone: 1 });
authSchema.index({ role: 1 });
authSchema.index({ status: 1 });

const Auth = mongoose.model("Auth", authSchema);

module.exports = Auth;
