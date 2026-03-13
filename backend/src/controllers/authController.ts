import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import prisma from '../config/database';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { generateEmailVerificationToken, generatePasswordResetToken } from '../utils/helpers';
import { sendVerificationEmail, sendPasswordResetEmail } from '../services/emailService';
import { AppError } from '../middlewares/errorHandler';
import { Role } from '@prisma/client';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1),
  role: z.enum(['DOCTOR', 'PARENT']),
  phone: z.string().optional(),
  licenseNumber: z.string().optional(),
  specialization: z.string().optional(),
  clinicName: z.string().optional(),
  address: z.string().optional(),
  emergencyContact: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = registerSchema.parse(req.body);
    const rounds = Number(process.env.BCRYPT_ROUNDS) || 12;
    const passwordHash = await bcrypt.hash(data.password, rounds);
    const verificationToken = generateEmailVerificationToken();

    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        role: data.role as Role,
        name: data.name,
        phone: data.phone,
        verificationToken,
        doctor:
          data.role === 'DOCTOR'
            ? {
                create: {
                  licenseNumber: data.licenseNumber ?? '',
                  specialization: data.specialization ?? '',
                  clinicName: data.clinicName,
                },
              }
            : undefined,
        parent:
          data.role === 'PARENT'
            ? {
                create: {
                  address: data.address,
                  emergencyContact: data.emergencyContact,
                },
              }
            : undefined,
      },
      include: { doctor: true, parent: true },
    });

    await sendVerificationEmail(user.email, user.name, verificationToken);

    res.status(201).json({
      success: true,
      message: 'Registration successful. Please verify your email.',
      data: { id: user.id, email: user.email, role: user.role, name: user.name },
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      next(new AppError('Invalid email or password', 401));
      return;
    }

    if (!user.isVerified) {
      next(new AppError('Please verify your email before logging in', 403));
      return;
    }

    const payload = { userId: user.id, email: user.email, role: user.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    await prisma.refreshToken.create({ data: { userId: user.id, token: refreshToken, expiresAt } });

    res.json({
      success: true,
      data: { accessToken, refreshToken, user: { id: user.id, email: user.email, role: user.role, name: user.name } },
    });
  } catch (err) {
    next(err);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { refreshToken } = req.body;
    if (refreshToken) {
      await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
    }
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
};

export const refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { refreshToken: token } = req.body;
    if (!token) {
      next(new AppError('Refresh token required', 400));
      return;
    }

    const stored = await prisma.refreshToken.findUnique({ where: { token } });
    if (!stored || stored.expiresAt < new Date()) {
      next(new AppError('Invalid or expired refresh token', 401));
      return;
    }

    const payload = verifyRefreshToken(token);
    const newPayload = { userId: payload.userId, email: payload.email, role: payload.role };
    const accessToken = generateAccessToken(newPayload);
    const newRefreshToken = generateRefreshToken(newPayload);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.refreshToken.delete({ where: { token } });
    await prisma.refreshToken.create({ data: { userId: payload.userId, token: newRefreshToken, expiresAt } });

    res.json({ success: true, data: { accessToken, refreshToken: newRefreshToken } });
  } catch (err) {
    next(err);
  }
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email } = z.object({ email: z.string().email() }).parse(req.body);
    const user = await prisma.user.findUnique({ where: { email } });

    if (user) {
      const token = generatePasswordResetToken();
      const expires = new Date(Date.now() + 3600000);
      await prisma.user.update({
        where: { id: user.id },
        data: { resetPasswordToken: token, resetPasswordExpires: expires },
      });
      await sendPasswordResetEmail(user.email, user.name, token);
    }

    res.json({ success: true, message: 'If that email is registered, a reset link has been sent.' });
  } catch (err) {
    next(err);
  }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { token, password } = z.object({ token: z.string(), password: z.string().min(8) }).parse(req.body);
    const user = await prisma.user.findFirst({
      where: { resetPasswordToken: token, resetPasswordExpires: { gt: new Date() } },
    });

    if (!user) {
      next(new AppError('Invalid or expired reset token', 400));
      return;
    }

    const rounds = Number(process.env.BCRYPT_ROUNDS) || 12;
    const passwordHash = await bcrypt.hash(password, rounds);
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash, resetPasswordToken: null, resetPasswordExpires: null },
    });

    res.json({ success: true, message: 'Password reset successful' });
  } catch (err) {
    next(err);
  }
};

export const verifyEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { token } = z.object({ token: z.string() }).parse(req.body);
    const user = await prisma.user.findFirst({ where: { verificationToken: token } });

    if (!user) {
      next(new AppError('Invalid verification token', 400));
      return;
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { isVerified: true, verificationToken: null },
    });

    res.json({ success: true, message: 'Email verified successfully' });
  } catch (err) {
    next(err);
  }
};
