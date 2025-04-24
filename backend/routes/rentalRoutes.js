import { Router } from "express";
import { createRental, getAllRental, getAllRentalByUserId, getRentalById, updateRentalStatus } from "../controllers/rentalControllers.js";
const router = Router();


router.post("/add", createRental);
router.get("/", getAllRental);
router.get("/:id", getRentalById);
router.get("/user/:id", getAllRentalByUserId);

router.patch("/update-status/:id", updateRentalStatus);

export default router;