const nodemailer = require('nodemailer');

/**
 * Send an email using Nodemailer.
 * Reads SMTP config from environment variables.
 */
const sendEmail = async ({ to, subject, html }) => {
  // Create transporter — uses Gmail by default; swap host/port for other providers
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // use an App Password for Gmail
    },
  });

  await transporter.sendMail({
    from: `"Iris" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};

module.exports = sendEmail;
