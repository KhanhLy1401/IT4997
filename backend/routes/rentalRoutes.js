import { Router } from "express";
import { createRental, getAllRental, getAllRentalByOwnerId, getAllRentalByUserId, getRentalById, updateRentalStatus } from "../controllers/rentalControllers.js";
const router = Router();


router.post("/add", createRental);
router.get("/", getAllRental);
router.get("/:id", getRentalById);
router.get("/user/:id", getAllRentalByUserId);
router.get("/owner/:id", getAllRentalByOwnerId);

router.patch("/update-status/:id", updateRentalStatus);

export default router;