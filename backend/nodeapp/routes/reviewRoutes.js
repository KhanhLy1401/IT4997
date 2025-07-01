import { Router } from "express";
import { addReview, deleteReview, getAllReview, getReviewByUser, getReviewsByBikeId, updateReview } from "../controllers/reviewController.js";

const router = Router();

router.post('/add', addReview);
router.get('/all-review', getAllReview);
router.patch('/update', updateReview);
router.get('/get-by-user/:userId', getReviewByUser);
router.get('/get-by-bike/:bikeId', getReviewsByBikeId);
router.delete('/delete/:reviewId', deleteReview);

export default router;