import {Router} from 'express';
import { signUpUser, signInUser } from '../controllers/authController.js';

const router = Router();

router.post('/sign-up', signUpUser);
router.post('/sign-in', signInUser);

export default router;