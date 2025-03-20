import { Router } from "express";
import { changeUserRole, getAllOwners, getAllUser, getUserById } from "../controllers/userControllers.js";


const router = Router();
router.patch('/change-role/:id', changeUserRole);
router.get('/',getAllUser);
router.get('/get-owners/', getAllOwners);

router.get('/:id', getUserById);


export default router;