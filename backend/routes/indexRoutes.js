import express from 'express';
import userRoutes from './userRoutes.js';
import authRoutes from './authRoutes.js'
import bikeRoutes from './bikeRoutes.js';
import rentalRoutes from './rentalRoutes.js'
import adminRoutes from './adminRoutes.js'
import paymentRoutes from './paymentRoutes.js'
const router = express.Router();

router.use('/auth', authRoutes);
router.use('/bike', bikeRoutes);
router.use('/user',userRoutes);
router.use('/rental', rentalRoutes);
router.use('/admin', adminRoutes);
router.use('/payment', paymentRoutes);

export default router;