const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
    },
    fullName: {
      type: String,
      trim: true,
    },
    phoneNumber: {
      type: String,
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
    specificAddress: {
      type: String,
      trim: true,
    },
    dateOfBirth: {
      type: Date,
    },
    gender: {
      type: String,
      enum: {
        values: ["Male", "Female", "Other"],
        message: "Giới tính không hợp lệ",
      },
    },
    bio: {
      type: String,
      trim: true,
    },
    skills: [
      {
        type: String,
        trim: true,
      },
    ],
    experience: [
      {
        companyName: {
          type: String,
          trim: true,
        },
        position: {
          type: String,
          trim: true,
        },
        startDate: {
          type: Date,
        },
        endDate: Date,
        description: {
          type: String,
          trim: true,
        },
      },
    ],
    education: [
      {
        school: {
          type: String,
          trim: true,
        },
        degree: {
          type: String,
          trim: true,
        },
        fieldOfStudy: {
          type: String,
          trim: true,
        },
        startDate: {
          type: Date,
        },
        endDate: Date,
        description: {
          type: String,
          trim: true,
        },
      },
    ],
    languages: [
      {
        language: {
          type: String,
          trim: true,
        },
        proficiency: {
          type: String,
          enum: {
            values: ["Basic", "Intermediate", "Advanced", "Native"],
            message: "Trình độ không hợp lệ",
          },
        },
      },
    ],
    certifications: [
      {
        name: {
          type: String,
          trim: true,
        },
        issuer: {
          type: String,
          trim: true,
        },
        date: {
          type: Date,
        },
        description: {
          type: String,
          trim: true,
        },
      },
    ],
    socialLinks: {
      linkedin: {
        type: String,
        trim: true,
      },
      github: {
        type: String,
        trim: true,
      },
      portfolio: {
        type: String,
        trim: true,
      },
    },
    expectedSalary: {
      type: Number,
      min: [0, "Lương không được âm"],
    },
    preferredJobTypes: [
      {
        type: String,
        enum: {
          values: [
            "Full-time",
            "Part-time",
            "Contract",
            "Internship",
            "Remote",
          ],
          message: "Loại công việc không hợp lệ",
        },
      },
    ],
    preferredLocations: [
      {
        type: String,
        trim: true,
      },
    ],
    isAvailable: {
      type: Boolean,
      default: true,
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    avatarUrl: {
      type: String,
      trim: true,
    },
    cvUrl: {
      type: String,
      trim: true,
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
// candidateSchema.index({ userId: 1 }); // Đã unique ở schema, không cần dòng này
candidateSchema.index({ fullName: 1 });
candidateSchema.index({ skills: 1 });
candidateSchema.index({ "experience.companyName": 1 });
candidateSchema.index({ "education.school": 1 });
candidateSchema.index({ "education.fieldOfStudy": 1 });
candidateSchema.index({ isAvailable: 1 });
candidateSchema.index({ isPublic: 1 });

module.exports = mongoose.model("Candidate", candidateSchema);
