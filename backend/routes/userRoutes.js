import { Router } from "express";
import { changeUserRole, getAllOwners, getAllUser, getUserById, requestOwner } from "../controllers/userControllers.js";
import {upload} from "../config/multer.js";

const router = Router();
router.patch('/change-role/:id', changeUserRole);
router.get('/',getAllUser);
router.get('/get-owners/', getAllOwners);

router.get('/:id', getUserById);
router.post('/request-owner',upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "license_image", maxCount: 1 },
    { name: "citizen_front", maxCount: 1 },
    { name: "citizen_back", maxCount: 1 },
  ]), requestOwner)


export default router;