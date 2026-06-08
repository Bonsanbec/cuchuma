import { env } from '$env/dynamic/private';

type Mail = { to: string; subject: string; text: string };

export async function sendMail(mail: Mail) {
  if (!env.SMTP_HOST || !env.SMTP_USER || !env.SMTP_PASSWORD || !env.MAIL_FROM) {
    return false;
  }
  const nodemailer = await import('nodemailer');
  const transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: Number(env.SMTP_PORT || 587),
    secure: env.SMTP_SECURE === 'true',
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASSWORD
    }
  });
  await transporter.sendMail({ from: env.MAIL_FROM, ...mail });
  return true;
}
