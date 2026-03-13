import { Router } from 'express';
import { getVaccines, getVaccineById, createVaccine, updateVaccine } from '../controllers/vaccineController';
import { authenticateToken, requireRole } from '../middlewares/auth';

const router = Router();
router.use(authenticateToken);
router.get('/', getVaccines);
router.get('/:id', getVaccineById);
router.post('/', requireRole('DOCTOR'), createVaccine);
router.put('/:id', requireRole('DOCTOR'), updateVaccine);

export default router;
