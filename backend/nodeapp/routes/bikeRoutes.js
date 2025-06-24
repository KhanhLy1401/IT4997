import { Router } from "express";
import { addBike, getAllBikes, getBikeById,deleteBikeById, deleteAllBikes, getBikesByOwnerId , searchAvailableBikes, getAllBikesNotPending} from "../controllers/bikeController.js";
import {upload} from "../config/multer.js";


const router = Router();

router.post('/add',upload.fields([
    { name: "images_front", maxCount: 1},
    { name: "images_back", maxCount: 1},
    { name: "images_side", maxCount: 1},
    { name: "bike_registration", maxCount: 1 },
    { name: "bike_insurance", maxCount: 1 },
  ]), addBike);
router.get('/get-all-bikes', getAllBikes)
router.get('/get-all-bikes-not-pending', getAllBikesNotPending)
router.delete('/delete-bikes', deleteAllBikes);
router.post('/search', searchAvailableBikes);
router.get('/get-by-owner/:id', getBikesByOwnerId);

router.get('/:id', getBikeById);
router.delete('/:id', deleteBikeById);

export default router;
