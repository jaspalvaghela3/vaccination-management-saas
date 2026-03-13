import prisma from '../config/database';
import { calculateVaccineDueDate, isOverdue } from '../utils/helpers';
import { VaccinationStatus } from '@prisma/client';

export interface ScheduleItem {
  vaccineId: string;
  vaccineName: string;
  doseNumber: number;
  recommendedAgeMonths: number;
  dueDate: Date;
  status: VaccinationStatus;
  record?: {
    id: string;
    administeredDate: Date | null;
    batchNumber: string | null;
    notes: string | null;
  };
}

export async function generateVaccinationSchedule(
  childId: string,
  dob: Date
): Promise<ScheduleItem[]> {
  const vaccines = await prisma.vaccine.findMany({ orderBy: { recommendedAgeMonths: 'asc' } });
  const existingRecords = await prisma.vaccinationRecord.findMany({
    where: { childId },
    include: { vaccine: true },
  });

  const recordMap = new Map(existingRecords.map((r) => [r.vaccineId, r]));

  return vaccines.map((vaccine) => {
    const dueDate = calculateVaccineDueDate(dob, vaccine.recommendedAgeMonths);
    const record = recordMap.get(vaccine.id);

    let status: VaccinationStatus;
    if (record) {
      status = record.status;
    } else if (isOverdue(dueDate)) {
      status = VaccinationStatus.OVERDUE;
    } else {
      status = VaccinationStatus.SCHEDULED;
    }

    return {
      vaccineId: vaccine.id,
      vaccineName: vaccine.name,
      doseNumber: vaccine.doseNumber,
      recommendedAgeMonths: vaccine.recommendedAgeMonths,
      dueDate,
      status,
      record: record
        ? {
            id: record.id,
            administeredDate: record.administeredDate,
            batchNumber: record.batchNumber,
            notes: record.notes,
          }
        : undefined,
    };
  });
}
