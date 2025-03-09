import express from 'express';
import userRoutes from './userRoutes.js';
import bikeRoutes from './bikeRoutes.js';
const router = express.Router();

router.use('/user', userRoutes);
router.use('/bike', bikeRoutes);

export default router;