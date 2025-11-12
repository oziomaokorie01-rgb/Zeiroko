const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
              }
              });

              async function sendVerificationEmail(to, token) {
                const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${encodeURIComponent(token)}`;
                  const info = await transporter.sendMail({
                      from: process.env.EMAIL_FROM,
                          to,
                              subject: 'Verify your Zeiroko email',
                                  html: `<p>Welcome to Zeiroko — click to verify:</p><p><a href="${verifyUrl}">Verify email</a></p>`
                                    });
                                      return info;
                                      }

                                      module.exports = { sendVerificationEmail };