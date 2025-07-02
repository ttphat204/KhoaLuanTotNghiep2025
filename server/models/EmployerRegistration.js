const mongoose = require("mongoose");

const employerRegistrationSchema = new mongoose.Schema({
  email: { type: String, required: true, trim: true, lowercase: true },
  phone: { type: String, required: true, trim: true },
  password: { type: String, required: true }, // sẽ hash trước khi lưu
  companyName: { type: String, required: true, trim: true },
  companyAddress: { type: String, required: true, trim: true },
  city: { type: String, required: true, trim: true },
  district: { type: String, required: true, trim: true },
  ward: { type: String, required: true, trim: true },
  companyWebsite: { type: String, trim: true },
  industry: { type: String, required: true, trim: true },
  companySize: { type: Number },
  companyDescription: { type: String },
  foundedYear: { type: Number },
  status: { type: String, default: 'pending', enum: ['pending', 'approved', 'rejected'] },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("EmployerRegistration", employerRegistrationSchema); 