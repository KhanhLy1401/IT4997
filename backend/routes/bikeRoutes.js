import { Router } from "express";
import { addBike, getAllBikes, getBikeById,deleteBikeById, deleteAllBikes } from "../controllers/bikeController.js";

const router = Router();

router.post('/add', addBike);
router.get('/get-all-bikes', getAllBikes)
router.delete('/delete-bikes', deleteAllBikes);
router.get('/:id', getBikeById);
router.delete('/:id', deleteBikeById);

export default router;
