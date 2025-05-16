import { Router } from "express";
import {createPayment, handleIPN} from "../controllers/paymentController.js";
const router = Router();

router.post('/create', createPayment);
router.post('/ipn', handleIPN);

export default router;