import { User } from '@prisma/client';
import { prismaDB } from '..';
import { emailTransporter } from '../constants';
import checkValidUuid from './checkValidUuid';
import randomstring from 'randomstring';

type FieldToCheck = 'id' | 'email';

export async function sendEmailVerificationEmail(
  email: string,
  id: string,
  name: string
) {
  try {
    const random = randomstring.generate();

    await prismaDB.user.update({
      where: { id },
      data: { emailVerificationString: random },
    });

    const message = await emailTransporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_ADDRESS}>`,
      to: email,
      subject: 'Verify your email address',
      text: 'Please verify your email address',
      html: `
        <p>Hi, <b>${name}.</b> Thanks for joining.</p>
        <p>Please visit this <a href="${process.env.WEB_URL}/user/verify-email/${id}?token=${random}" target="_blank" rel="noreferrer">link</a> to verify your email address</p>
      `,
    });
  } catch (err) {
    console.error(err);
  }
}
