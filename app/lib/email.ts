import nodemailer from "nodemailer";

export type EmailOptions = {
  to: string;
  subject: string;
  text: string;
  html?: string;
  from?: string;
};

function createMailTransport() {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const secure = process.env.SMTP_SECURE === "true";

  if (!host || !port || !user || !pass) {
    throw new Error(
      "Missing SMTP environment variables. Set SMTP_HOST, SMTP_PORT, SMTP_USER, and SMTP_PASS."
    );
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });
}

export async function sendEmail({ to, subject, text, html, from }: EmailOptions) {
  const transporter = createMailTransport();

  const mailFrom = from || process.env.SMTP_FROM || `Car Rental <${process.env.SMTP_USER}>`;

  const info = await transporter.sendMail({
    from: mailFrom,
    to,
    subject,
    text,
    html,
  });

  return info;
}
