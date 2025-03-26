import {Router} from 'express';
import { approveOwner, getPendingOwner } from '../controllers/adminController.js';

const router = Router();
router.get('/get-pending-owner', getPendingOwner);
router.post("/approve-owner", approveOwner);

export default router;