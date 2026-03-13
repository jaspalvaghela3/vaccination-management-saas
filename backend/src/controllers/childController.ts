import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { Gender, BloodGroup } from '@prisma/client';
import prisma from '../config/database';
import { AppError } from '../middlewares/errorHandler';

const childSchema = z.object({
  name: z.string().min(1),
  dateOfBirth: z.string().transform((s) => new Date(s)),
  gender: z.nativeEnum(Gender),
  bloodGroup: z.nativeEnum(BloodGroup).optional(),
  birthWeight: z.number().positive().optional(),
  allergies: z.string().optional(),
  medicalNotes: z.string().optional(),
});

export const getChildren = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { userId, role } = req.user!;

    if (role === 'PARENT') {
      const parent = await prisma.parent.findUnique({ where: { userId } });
      if (!parent) {
        next(new AppError('Parent profile not found', 404));
        return;
      }

      const children = await prisma.child.findMany({
        where: { parentId: parent.id },
        include: { assignedDoctor: { include: { user: { select: { name: true, email: true } } } } },
      });
      res.json({ success: true, data: children });
    } else {
      const doctor = await prisma.doctor.findUnique({ where: { userId } });
      if (!doctor) {
        next(new AppError('Doctor profile not found', 404));
        return;
      }

      const children = await prisma.child.findMany({
        where: { assignedDoctorId: doctor.id },
        include: { parent: { include: { user: { select: { name: true, email: true } } } } },
      });
      res.json({ success: true, data: children });
    }
  } catch (err) {
    next(err);
  }
};

export const getChild = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { userId, role } = req.user!;
    const child = await prisma.child.findUnique({
      where: { id },
      include: {
        assignedDoctor: { include: { user: { select: { name: true, email: true } } } },
        parent: { include: { user: { select: { name: true, email: true } } } },
      },
    });

    if (!child) {
      next(new AppError('Child not found', 404));
      return;
    }

    if (role === 'PARENT') {
      const parent = await prisma.parent.findUnique({ where: { userId } });
      if (!parent || child.parentId !== parent.id) {
        next(new AppError('Access denied', 403));
        return;
      }
    } else {
      const doctor = await prisma.doctor.findUnique({ where: { userId } });
      if (!doctor || child.assignedDoctorId !== doctor.id) {
        next(new AppError('Access denied', 403));
        return;
      }
    }

    res.json({ success: true, data: child });
  } catch (err) {
    next(err);
  }
};

export const createChild = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { userId } = req.user!;
    const parent = await prisma.parent.findUnique({ where: { userId } });
    if (!parent) {
      next(new AppError('Parent profile not found', 404));
      return;
    }

    const data = childSchema.parse(req.body);
    const child = await prisma.child.create({
      data: { ...data, parentId: parent.id },
    });

    res.status(201).json({ success: true, data: child });
  } catch (err) {
    next(err);
  }
};

export const updateChild = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { userId } = req.user!;
    const parent = await prisma.parent.findUnique({ where: { userId } });
    if (!parent) {
      next(new AppError('Parent profile not found', 404));
      return;
    }

    const child = await prisma.child.findUnique({ where: { id } });
    if (!child || child.parentId !== parent.id) {
      next(new AppError('Child not found or access denied', 404));
      return;
    }

    const data = childSchema.partial().parse(req.body);
    const updated = await prisma.child.update({ where: { id }, data });

    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};

export const deleteChild = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { userId } = req.user!;
    const parent = await prisma.parent.findUnique({ where: { userId } });
    if (!parent) {
      next(new AppError('Parent profile not found', 404));
      return;
    }

    const child = await prisma.child.findUnique({ where: { id } });
    if (!child || child.parentId !== parent.id) {
      next(new AppError('Child not found or access denied', 404));
      return;
    }

    await prisma.child.delete({ where: { id } });
    res.json({ success: true, message: 'Child deleted successfully' });
  } catch (err) {
    next(err);
  }
};

export const assignDoctor = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { doctorId } = z.object({ doctorId: z.string() }).parse(req.body);
    const { userId } = req.user!;
    const parent = await prisma.parent.findUnique({ where: { userId } });
    if (!parent) {
      next(new AppError('Parent profile not found', 404));
      return;
    }

    const child = await prisma.child.findUnique({ where: { id } });
    if (!child || child.parentId !== parent.id) {
      next(new AppError('Child not found or access denied', 404));
      return;
    }

    const doctor = await prisma.doctor.findUnique({ where: { id: doctorId } });
    if (!doctor) {
      next(new AppError('Doctor not found', 404));
      return;
    }

    const updated = await prisma.child.update({ where: { id }, data: { assignedDoctorId: doctorId } });
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};
