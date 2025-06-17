import {Router} from 'express';
import { approveBike, approveOwner, getPendingBike, getPendingLicense, getPendingOwner } from '../controllers/adminController.js';

const router = Router();
router.get('/get-pending-owner', getPendingOwner);
router.get('/get-pending-license', getPendingLicense);
router.patch("/approve-owner", approveOwner);
router.patch("/approve-bike", approveBike);
router.get("/get-pending-bike", getPendingBike);

export default router;