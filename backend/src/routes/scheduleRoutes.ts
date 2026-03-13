import { Router } from 'express';
import {
  getChildSchedule,
  getVaccinationRecords,
  createVaccinationRecord,
  updateVaccinationRecord,
} from '../controllers/scheduleController';
import { authenticateToken } from '../middlewares/auth';

const router = Router();
router.use(authenticateToken);
router.get('/children/:childId/schedule', getChildSchedule);
router.get('/children/:childId/vaccination-records', getVaccinationRecords);
router.post('/vaccination-records', createVaccinationRecord);
router.put('/vaccination-records/:id', updateVaccinationRecord);

export default router;
