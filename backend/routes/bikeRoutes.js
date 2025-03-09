import { Router } from "express";
import { addBike } from "../controllers/bikeController.js";

const router = Router();

router.post('/add', addBike);

export default router;
