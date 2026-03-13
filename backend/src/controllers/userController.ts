import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import prisma from '../config/database';
import { AppError } from '../middlewares/errorHandler';

export const getProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        role: true,
        name: true,
        phone: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
        doctor: true,
        parent: true,
      },
    });

    if (!user) {
      next(new AppError('User not found', 404));
      return;
    }
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const schema = z.object({
      name: z.string().min(1).optional(),
      phone: z.string().optional(),
      address: z.string().optional(),
      emergencyContact: z.string().optional(),
      specialization: z.string().optional(),
      clinicName: z.string().optional(),
    });
    const data = schema.parse(req.body);

    const user = await prisma.user.update({
      where: { id: userId },
      data: { name: data.name, phone: data.phone },
    });

    if (user.role === 'DOCTOR' && (data.specialization || data.clinicName)) {
      await prisma.doctor.update({
        where: { userId },
        data: { specialization: data.specialization, clinicName: data.clinicName, address: data.address },
      });
    }

    if (user.role === 'PARENT' && (data.address || data.emergencyContact)) {
      await prisma.parent.update({
        where: { userId },
        data: { address: data.address, emergencyContact: data.emergencyContact },
      });
    }

    res.json({ success: true, message: 'Profile updated successfully' });
  } catch (err) {
    next(err);
  }
};

export const changePassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { currentPassword, newPassword } = z.object({
      currentPassword: z.string(),
      newPassword: z.string().min(8),
    }).parse(req.body);

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      next(new AppError('User not found', 404));
      return;
    }

    const valid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!valid) {
      next(new AppError('Current password is incorrect', 400));
      return;
    }

    const rounds = Number(process.env.BCRYPT_ROUNDS) || 12;
    const passwordHash = await bcrypt.hash(newPassword, rounds);
    await prisma.user.update({ where: { id: userId }, data: { passwordHash } });

    res.json({ success: true, message: 'Password changed successfully' });
  } catch (err) {
    next(err);
  }
};

export const getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, email: true, role: true, name: true, phone: true, isVerified: true, createdAt: true },
    });
    res.json({ success: true, data: users });
  } catch (err) {
    next(err);
  }
};
