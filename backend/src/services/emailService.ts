import nodemailer from 'nodemailer';
import logger from '../utils/logger';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendVerificationEmail(to: string, name: string, token: string): Promise<void> {
  const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject: 'Verify your email address',
      html: `
        <h2>Hello ${name},</h2>
        <p>Please verify your email by clicking the link below:</p>
        <a href="${verifyUrl}">Verify Email</a>
        <p>This link expires in 24 hours.</p>
      `,
    });
  } catch (err) {
    logger.error('Failed to send verification email', { error: err, to });
  }
}

export async function sendPasswordResetEmail(to: string, name: string, token: string): Promise<void> {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject: 'Password Reset Request',
      html: `
        <h2>Hello ${name},</h2>
        <p>You requested a password reset. Click the link below:</p>
        <a href="${resetUrl}">Reset Password</a>
        <p>This link expires in 1 hour. If you did not request this, please ignore this email.</p>
      `,
    });
  } catch (err) {
    logger.error('Failed to send password reset email', { error: err, to });
  }
}

export async function sendVaccinationReminderEmail(
  to: string,
  parentName: string,
  childName: string,
  vaccineName: string,
  dueDate: string
): Promise<void> {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject: `Vaccination Reminder: ${vaccineName} for ${childName}`,
      html: `
        <h2>Hello ${parentName},</h2>
        <p>This is a reminder that ${childName} is due for the <strong>${vaccineName}</strong> vaccine on <strong>${dueDate}</strong>.</p>
        <p>Please contact your healthcare provider to schedule the appointment.</p>
      `,
    });
  } catch (err) {
    logger.error('Failed to send vaccination reminder email', { error: err, to });
  }
}
