const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,       // smtp.gmail.com
  port: process.env.EMAIL_PORT,       // 587
  secure: false,                      // must be false for port 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
      to,               // ✅ now using passed param
      subject,          // ✅ passed subject
      html,             // ✅ passed HTML
    });
    console.log(`✅ Email sent to ${to}`);
  } catch (err) {
    console.error("❌ Email Error:", err.message);
  }
};

module.exports = { sendEmail };
