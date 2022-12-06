import { createTransport } from 'nodemailer';

export const emailTransporter = createTransport({
  host: process.env.SMTP_HOST_NAME,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});
