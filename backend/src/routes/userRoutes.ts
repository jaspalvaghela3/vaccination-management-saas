import { Router } from 'express';
import { getProfile, updateProfile, changePassword, getUsers } from '../controllers/userController';
import { authenticateToken } from '../middlewares/auth';

const router = Router();
router.use(authenticateToken);
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/change-password', changePassword);
router.get('/', getUsers);

export default router;
