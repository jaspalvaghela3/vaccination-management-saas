import { Router } from 'express';
import { getChildren, getChild, createChild, updateChild, deleteChild, assignDoctor } from '../controllers/childController';
import { authenticateToken, requireRole } from '../middlewares/auth';

const router = Router();
router.use(authenticateToken);
router.get('/', getChildren);
router.get('/:id', getChild);
router.post('/', requireRole('PARENT'), createChild);
router.put('/:id', requireRole('PARENT'), updateChild);
router.delete('/:id', requireRole('PARENT'), deleteChild);
router.post('/:id/assign-doctor', requireRole('PARENT'), assignDoctor);

export default router;
