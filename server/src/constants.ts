import { createTransport } from 'nodemailer';
import multer, { FileFilterCallback } from 'multer';
import { v4 as uuidV4 } from 'uuid';
import { Request } from 'express';

export const emailTransporter = createTransport({
  host: process.env.SMTP_HOST_NAME,
  port: Number(process.env.SMTP_PORT) || 0,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const multerStorage = multer.diskStorage({
  destination: 'dist/uploads/temp/',
  filename: (req: Request, file: Express.Multer.File, cb) => {
    const ext = file.mimetype.split('/')[1];
    cb(null, `${uuidV4()}-${Date.now()}.${ext}`);
  },
});

export const multerFileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/webp'
  ) {
    return cb(null, true);
  } else {
    return cb(null, false);
  }
};

export const multerUpload = multer({
  fileFilter: multerFileFilter,
  storage: multerStorage,
});
