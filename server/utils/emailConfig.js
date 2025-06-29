const nodemailer = require('nodemailer');

// Cấu hình email transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'your-email@gmail.com',
      pass: process.env.EMAIL_PASS || 'your-app-password'
    }
  });
};

// Template email reset password
const getResetPasswordTemplate = (userName, resetUrl) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 10px; text-align: center;">
        <h2 style="color: #333; margin-bottom: 20px;">Reset Mật khẩu</h2>
        <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <p style="color: #555; font-size: 16px; margin-bottom: 20px;">
            Xin chào <strong>${userName}</strong>,
          </p>
          <p style="color: #555; font-size: 16px; margin-bottom: 20px;">
            Bạn đã yêu cầu reset mật khẩu cho tài khoản của mình.
          </p>
          <p style="color: #555; font-size: 16px; margin-bottom: 30px;">
            Vui lòng click vào nút bên dưới để đặt lại mật khẩu:
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background-color: #007bff; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold; font-size: 16px;">
              Reset Mật khẩu
            </a>
          </div>
          <p style="color: #777; font-size: 14px; margin-bottom: 20px;">
            Link này sẽ hết hạn sau <strong>1 giờ</strong>.
          </p>
          <p style="color: #777; font-size: 14px; margin-bottom: 20px;">
            Nếu bạn không yêu cầu reset mật khẩu, vui lòng bỏ qua email này.
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #999; font-size: 12px; text-align: center;">
            Trân trọng,<br>
            <strong>Job Portal Team</strong>
          </p>
        </div>
      </div>
    </div>
  `;
};

// Template email thông báo đổi mật khẩu thành công
const getPasswordChangedTemplate = (userName) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 10px; text-align: center;">
        <h2 style="color: #28a745; margin-bottom: 20px;">Mật khẩu đã được thay đổi</h2>
        <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <p style="color: #555; font-size: 16px; margin-bottom: 20px;">
            Xin chào <strong>${userName}</strong>,
          </p>
          <p style="color: #555; font-size: 16px; margin-bottom: 20px;">
            Mật khẩu của bạn đã được thay đổi thành công.
          </p>
          <p style="color: #555; font-size: 16px; margin-bottom: 20px;">
            Nếu bạn không thực hiện thay đổi này, vui lòng liên hệ với chúng tôi ngay lập tức.
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #999; font-size: 12px; text-align: center;">
            Trân trọng,<br>
            <strong>Job Portal Team</strong>
          </p>
        </div>
      </div>
    </div>
  `;
};

module.exports = {
  createTransporter,
  getResetPasswordTemplate,
  getPasswordChangedTemplate
}; 