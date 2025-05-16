import { Router } from "express";
import { blockUser, changeUserRole, getAllOwners, getAllUser, getUserById, requestLicense, requestOwner, unblockUser } from "../controllers/userControllers.js";
import {upload} from "../config/multer.js";

const router = Router();
router.patch('/change-role/:id', changeUserRole);
router.get('/',getAllUser);
router.get('/get-owners/', getAllOwners);

router.get('/:id', getUserById);
router.patch("/block-user/:id", blockUser )
router.patch("/unblock-user/:id", unblockUser )
router.post('/request-owner',upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "license_image", maxCount: 1 },
    { name: "citizen_front", maxCount: 1 },
    { name: "citizen_back", maxCount: 1 },
  ]), requestOwner)

router.post("/request-license", upload.fields([
  {name: "license_image_url", maxCount: 1}
]), requestLicense);

export default router;