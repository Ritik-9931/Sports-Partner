import nodemailer from "nodemailer";
import sgMail from "@sendgrid/mail";

const sendEmail = async (to, subject, html) => {
  // If SENDGRID_API_KEY is set, prefer SendGrid (works reliably from cloud hosts)
  if (process.env.SENDGRID_API_KEY) {
    try {
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);

      const msg = {
        to,
        from: process.env.SENDGRID_FROM || process.env.EMAIL_USER,
        subject,
        html,
      };

      const res = await sgMail.send(msg);
      console.log("SendGrid email sent:", res && res[0] && res[0].statusCode);
      return;
    } catch (err) {
      console.error("SendGrid send failed:", err);
      throw new Error("SendGrid email send failed: " + (err.message || err));
    }
  }

  // Fallback to nodemailer if SendGrid isn't configured
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error("Email service is not configured. Set SENDGRID_API_KEY or EMAIL_USER and EMAIL_PASS.");
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,

    family: 4,
    
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    // timeouts to avoid hanging requests in production
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,
  });

  try {
    // verify connection/configuration before attempting to send
    await transporter.verify();
  } catch (err) {
    console.error("Email verify failed:", err);
    throw new Error("Unable to connect to SMTP server: " + (err.message || err));
  }

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
    });

    console.log("Email sent:", info && info.messageId ? info.messageId : info);
  } catch (err) {
    console.error("sendMail failed:", err);
    throw new Error("Email send failed: " + (err.message || err));
  }
};

export default sendEmail;
