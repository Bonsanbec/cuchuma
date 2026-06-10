import { env } from '$env/dynamic/private';

type Mail = { to: string; subject: string; html: string };

export async function sendMail(mail: Mail) {
  if (!env.SMTP_HOST || !env.SMTP_USER || !env.SMTP_PASSWORD || !env.MAIL_FROM) {
    return false;
  }
  try {
    const nodemailer = await import('nodemailer');
    const transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: Number(env.SMTP_PORT || 587),
      secure: env.SMTP_SECURE === 'true',
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASSWORD
      },
      tls: {
        // Allow self-signed or invalid certificates, typical for local SMTP servers on same machine
        rejectUnauthorized: env.SMTP_REJECT_UNAUTHORIZED === 'true'
      },
      connectionTimeout: 5000,
      greetingTimeout: 5000,
      socketTimeout: 5000
    });
    await transporter.sendMail({ from: env.MAIL_FROM, ...mail });
    return true;
  } catch (error) {
    console.error('SMTP Mail sending failed:', error);
    return false;
  }
}
