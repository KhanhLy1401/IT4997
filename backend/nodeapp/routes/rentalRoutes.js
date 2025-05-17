import { Router } from "express";
import { createRental, getAllRental, getAllRentalByOwnerId, getMonthlyRentalCount, getBikeTypeInRental, getAllRentalByUserId, getRecentRevenue, getRentalById, updateRentalStatus, getAllRecentRevenue } from "../controllers/rentalControllers.js";
const router = Router();


router.post("/add", createRental);
router.get("/", getAllRental);
router.get("/all-revenue", getAllRecentRevenue);

router.get("/user/:id", getAllRentalByUserId);
router.get("/owner/:id", getAllRentalByOwnerId);
router.get("/revenue/:ownerId", getRecentRevenue);
router.get("/bike-type/:ownerId", getBikeTypeInRental);
router.get("/count-by-month/:ownerId", getMonthlyRentalCount);
router.get("/:id", getRentalById);


router.patch("/update-status/:id", updateRentalStatus);

export default router;