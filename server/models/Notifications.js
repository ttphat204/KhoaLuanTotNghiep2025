const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "UserId là bắt buộc"],
    },
    type: {
      type: String,
      required: [true, "Loại thông báo là bắt buộc"],
      enum: {
        values: ["system", "job_match", "application_status", "new_message"],
        message: "Loại thông báo không hợp lệ",
      },
    },
    message: {
      type: String,
      required: [true, "Nội dung thông báo là bắt buộc"],
    },
    read: {
      type: Boolean,
      default: false,
    },
    link: {
      type: String,
      trim: true,
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
notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, read: 1 });

module.exports = mongoose.model("Notification", notificationSchema);
