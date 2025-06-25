import {Router} from 'express';
import { approveBike, approveOwner, getPendingBike, getPendingLicense, getPendingOwner, getOwnersWithBikes } from '../controllers/adminController.js';

const router = Router();
router.get('/get-pending-owner', getPendingOwner);
router.get('/get-pending-license', getPendingLicense);
router.patch("/approve-owner", approveOwner);
router.patch("/approve-bike", approveBike);
router.get("/get-pending-bike", getPendingBike);
router.get("/get-owner-with-bike", getOwnersWithBikes);

export default router;