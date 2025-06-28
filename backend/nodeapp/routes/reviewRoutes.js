import { Router } from "express";
import { addReview, deleteReview, getReviewByUser, getReviewsByBikeId, updateReview } from "../controllers/reviewController.js";

const router = Router();

router.post('/add', addReview);
router.patch('/update', updateReview);
router.get('/get-by-user/:userId', getReviewByUser);
router.get('/get-by-bike/:bikeId', getReviewsByBikeId);
router.delete('/delete', deleteReview);

export default router;