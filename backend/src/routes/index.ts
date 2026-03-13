import { Router } from 'express';
import authRoutes from './authRoutes';
import userRoutes from './userRoutes';
import childRoutes from './childRoutes';
import vaccineRoutes from './vaccineRoutes';
import scheduleRoutes from './scheduleRoutes';

const router = Router();
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/children', childRoutes);
router.use('/vaccines', vaccineRoutes);
router.use('/', scheduleRoutes);

export default router;
