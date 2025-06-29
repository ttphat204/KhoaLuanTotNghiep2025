const express = require("express");
const router = express.Router();
const InterviewController = require("../controllers/InterviewController");
const auth = require("../middleware/auth");

// Lấy danh sách phỏng vấn (GET /interviews)
router.get("/", auth, InterviewController.getAll);

// Tạo mới phỏng vấn (POST /interviews)
router.post("/", auth, InterviewController.create);

// Cập nhật phỏng vấn (PUT /interviews/:id)
router.put("/:id", auth, InterviewController.update);

// Xóa phỏng vấn (DELETE /interviews/:id)
router.delete("/:id", auth, InterviewController.delete);

// Gửi tin nhắn (POST /interviews/:id/messages)
router.post("/:id/messages", auth, InterviewController.sendMessage);

// Lấy danh sách tin nhắn (GET /interviews/:id/messages)
router.get("/:id/messages", auth, InterviewController.getMessages);

module.exports = router;
