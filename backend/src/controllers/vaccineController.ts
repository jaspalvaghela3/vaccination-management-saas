import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import prisma from '../config/database';
import { AppError } from '../middlewares/errorHandler';

const vaccineSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  recommendedAgeMonths: z.number().min(0),
  doseNumber: z.number().int().min(1),
  isMandatory: z.boolean().default(true),
  sideEffects: z.string().optional(),
  precautions: z.string().optional(),
  schedule: z.string().optional(),
});

export const getVaccines = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const vaccines = await prisma.vaccine.findMany({ orderBy: { recommendedAgeMonths: 'asc' } });
    res.json({ success: true, data: vaccines });
  } catch (err) {
    next(err);
  }
};

export const getVaccineById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const vaccine = await prisma.vaccine.findUnique({ where: { id: req.params.id } });
    if (!vaccine) {
      next(new AppError('Vaccine not found', 404));
      return;
    }
    res.json({ success: true, data: vaccine });
  } catch (err) {
    next(err);
  }
};

export const createVaccine = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = vaccineSchema.parse(req.body);
    const vaccine = await prisma.vaccine.create({ data });
    res.status(201).json({ success: true, data: vaccine });
  } catch (err) {
    next(err);
  }
};

export const updateVaccine = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const vaccine = await prisma.vaccine.findUnique({ where: { id: req.params.id } });
    if (!vaccine) {
      next(new AppError('Vaccine not found', 404));
      return;
    }
    const data = vaccineSchema.partial().parse(req.body);
    const updated = await prisma.vaccine.update({ where: { id: req.params.id }, data });
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};
