import express from 'express';
import userRoutes from './userRoutes.js';
import authRoutes from './authRoutes.js'
import bikeRoutes from './bikeRoutes.js';
import rentalRoutes from './rentalRoutes.js'
import adminRoutes from './adminRoutes.js'
const router = express.Router();

router.use('/auth', authRoutes);
router.use('/bike', bikeRoutes);
router.use('/user',userRoutes);
router.use('/rental', rentalRoutes);
router.use('/admin', adminRoutes);

export default router;