const Interview = require("../models/Interviews");
const mongoose = require("mongoose");

// Helper: kiểm tra ObjectId hợp lệ
function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

class InterviewController {
  // Lấy danh sách phỏng vấn (có phân trang, lọc theo candidate/employer)
  async getAll(req, res) {
    try {
      const { candidateId, employerId, page = 1, limit = 10 } = req.query;
      const query = {};
      if (candidateId && isValidObjectId(candidateId))
        query.candidateId = candidateId;
      if (employerId && isValidObjectId(employerId))
        query.employerId = employerId;
      const skip = (parseInt(page) - 1) * parseInt(limit);
      const total = await Interview.countDocuments(query);
      const interviews = await Interview.find(query)
        .sort({ interviewDate: -1 })
        .skip(skip)
        .limit(parseInt(limit));
      res.json({
        data: interviews,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
    }
  }

  // Tạo mới lịch phỏng vấn
  async create(req, res) {
    try {
      const {
        applicationId,
        employerId,
        candidateId,
        interviewDate,
        interviewTime,
        interviewType,
        interviewLocation,
        interviewerNames,
        status,
        feedback,
        notes,
      } = req.body;
      // Validate cơ bản
      if (
        !applicationId ||
        !employerId ||
        !candidateId ||
        !interviewDate ||
        !interviewTime ||
        !interviewType ||
        !interviewLocation
      ) {
        return res.status(400).json({ message: "Thiếu thông tin bắt buộc" });
      }
      const interview = new Interview({
        applicationId,
        employerId,
        candidateId,
        interviewDate,
        interviewTime,
        interviewType,
        interviewLocation,
        interviewerNames,
        status,
        feedback,
        notes,
      });
      await interview.save();
      res.status(201).json({ message: "Tạo phỏng vấn thành công", interview });
    } catch (error) {
      res
        .status(400)
        .json({ message: "Tạo phỏng vấn thất bại", error: error.message });
    }
  }

  // Cập nhật lịch phỏng vấn
  async update(req, res) {
    try {
      const { id } = req.params;
      if (!isValidObjectId(id))
        return res.status(400).json({ message: "ID không hợp lệ" });
      const data = req.body;
      const interview = await Interview.findByIdAndUpdate(id, data, {
        new: true,
      });
      if (!interview)
        return res.status(404).json({ message: "Không tìm thấy phỏng vấn" });
      res.json({ message: "Cập nhật thành công", interview });
    } catch (error) {
      res
        .status(400)
        .json({ message: "Cập nhật thất bại", error: error.message });
    }
  }

  // Xóa lịch phỏng vấn
  async delete(req, res) {
    try {
      const { id } = req.params;
      if (!isValidObjectId(id))
        return res.status(400).json({ message: "ID không hợp lệ" });
      const interview = await Interview.findByIdAndDelete(id);
      if (!interview)
        return res.status(404).json({ message: "Không tìm thấy phỏng vấn" });
      res.json({ message: "Đã xóa phỏng vấn" });
    } catch (error) {
      res.status(500).json({ message: "Xóa thất bại", error: error.message });
    }
  }

  // Gửi tin nhắn/liên hệ ứng viên (lưu vào mảng messages trong document phỏng vấn)
  async sendMessage(req, res) {
    try {
      const { id } = req.params;
      if (!isValidObjectId(id))
        return res.status(400).json({ message: "ID không hợp lệ" });
      const { senderId, senderRole, message } = req.body;
      if (!senderId || !senderRole || !message)
        return res
          .status(400)
          .json({ message: "Thiếu thông tin gửi tin nhắn" });
      const interview = await Interview.findById(id);
      if (!interview)
        return res.status(404).json({ message: "Không tìm thấy phỏng vấn" });
      // Chuẩn bị mảng messages nếu chưa có
      if (!interview.messages) interview.messages = [];
      interview.messages.push({
        senderId,
        senderRole,
        message,
        time: new Date(),
      });
      await interview.save();
      res.json({
        message: "Gửi tin nhắn thành công",
        messages: interview.messages,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Gửi tin nhắn thất bại", error: error.message });
    }
  }

  // Lấy danh sách tin nhắn của một phỏng vấn (có phân trang)
  async getMessages(req, res) {
    try {
      const { id } = req.params;
      const { page = 1, limit = 20 } = req.query;
      if (!isValidObjectId(id))
        return res.status(400).json({ message: "ID không hợp lệ" });
      const interview = await Interview.findById(id);
      if (!interview)
        return res.status(404).json({ message: "Không tìm thấy phỏng vấn" });
      const messages = interview.messages || [];
      const start = (parseInt(page) - 1) * parseInt(limit);
      const paged = messages.slice(start, start + parseInt(limit));
      res.json({
        data: paged,
        pagination: {
          total: messages.length,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(messages.length / limit),
        },
      });
    } catch (error) {
      res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
    }
  }
}

module.exports = new InterviewController();
