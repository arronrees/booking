import { createTransport } from 'nodemailer';

export const emailTransporter = createTransport({
  host: process.env.SMTP_HOST_NAME,
  port: Number(process.env.SMTP_PORT) || 0,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});
