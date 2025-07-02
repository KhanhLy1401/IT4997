import { Router } from "express";
import { createRental, getAllRental, getAllRentalByOwnerId,getAllRentalConfirmedByOwnerId, getMonthlyRentalCount, getBikeTypeInRental, getAllRentalByUserId, getRecentRevenue, getRentalById, updateRentalStatus, getAllRecentRevenue, getMonthlyOwnerRevenueStats } from "../controllers/rentalControllers.js";
const router = Router();


router.post("/add", createRental);
router.get("/", getAllRental);
router.get("/all-revenue", getAllRecentRevenue);

router.get("/user/:id", getAllRentalByUserId);
router.get("/owner/:id", getAllRentalByOwnerId);
router.get("/confirmed/:id", getAllRentalConfirmedByOwnerId);
router.get("/revenue/:ownerId", getRecentRevenue);
router.get("/by-month", getMonthlyOwnerRevenueStats);
router.get("/bike-type/:ownerId", getBikeTypeInRental);
router.get("/count-by-month/:ownerId", getMonthlyRentalCount);
router.get("/:id", getRentalById);


router.patch("/update-status/:id", updateRentalStatus);

export default router;