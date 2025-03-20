import { Router } from "express";
import { createRental, getAllRental, getRentalById, updateRentalStatus } from "../controllers/rentalControllers.js";
const router = Router();


router.post("/add", createRental);
router.get("/", getAllRental);
router.get("/:id", getRentalById);
router.patch("/update-status/:id", updateRentalStatus);

export default router;