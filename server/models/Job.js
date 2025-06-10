const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  salary: { type: String },
  description: { type: String },
  logo: { type: String },
  expireDate: { type: String },
  category: { type: String, required: true },
});

module.exports = mongoose.model("Job", jobSchema); 