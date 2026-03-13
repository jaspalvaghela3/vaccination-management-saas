import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { VaccinationStatus } from '@prisma/client';
import prisma from '../config/database';
import { generateVaccinationSchedule } from '../services/scheduleService';
import { AppError } from '../middlewares/errorHandler';

export const getChildSchedule = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { childId } = req.params;
    const { userId, role } = req.user!;

    const child = await prisma.child.findUnique({ where: { id: childId } });
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

    const schedule = await generateVaccinationSchedule(childId, child.dateOfBirth);
    res.json({ success: true, data: schedule });
  } catch (err) {
    next(err);
  }
};

export const getVaccinationRecords = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { childId } = req.params;
    const { userId, role } = req.user!;

    const child = await prisma.child.findUnique({ where: { id: childId } });
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
    }

    const records = await prisma.vaccinationRecord.findMany({
      where: { childId },
      include: { vaccine: true, administeredByDoctor: { include: { user: { select: { name: true } } } } },
      orderBy: { scheduledDate: 'asc' },
    });

    res.json({ success: true, data: records });
  } catch (err) {
    next(err);
  }
};

export const createVaccinationRecord = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const schema = z.object({
      childId: z.string(),
      vaccineId: z.string(),
      scheduledDate: z.string().transform((s) => new Date(s)),
      notes: z.string().optional(),
    });
    const data = schema.parse(req.body);

    const child = await prisma.child.findUnique({ where: { id: data.childId } });
    if (!child) {
      next(new AppError('Child not found', 404));
      return;
    }

    const record = await prisma.vaccinationRecord.create({
      data: {
        childId: data.childId,
        vaccineId: data.vaccineId,
        scheduledDate: data.scheduledDate,
        notes: data.notes,
        status: VaccinationStatus.SCHEDULED,
      },
      include: { vaccine: true },
    });

    res.status(201).json({ success: true, data: record });
  } catch (err) {
    next(err);
  }
};

export const updateVaccinationRecord = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { userId } = req.user!;

    const schema = z.object({
      status: z.nativeEnum(VaccinationStatus).optional(),
      administeredDate: z.string().transform((s) => new Date(s)).optional(),
      batchNumber: z.string().optional(),
      notes: z.string().optional(),
    });
    const data = schema.parse(req.body);

    const record = await prisma.vaccinationRecord.findUnique({ where: { id } });
    if (!record) {
      next(new AppError('Vaccination record not found', 404));
      return;
    }

    const doctor = await prisma.doctor.findUnique({ where: { userId } });

    const isAdministeredByCurrentDoctor =
      data.status === VaccinationStatus.ADMINISTERED && doctor != null;
    const administeredByDoctorId = isAdministeredByCurrentDoctor
      ? doctor.id
      : record.administeredByDoctorId;

    const updated = await prisma.vaccinationRecord.update({
      where: { id },
      data: {
        ...data,
        administeredByDoctorId,
      },
      include: { vaccine: true },
    });

    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};
