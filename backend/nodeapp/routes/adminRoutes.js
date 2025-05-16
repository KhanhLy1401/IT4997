import {Router} from 'express';
import { approveLicense, approveOwner, getPendingLicense, getPendingOwner } from '../controllers/adminController.js';

const router = Router();
router.get('/get-pending-owner', getPendingOwner);
router.get('/get-pending-license', getPendingLicense);
router.patch("/approve-owner", approveOwner);
router.patch("/approve-license", approveLicense);

export default router;