import express from 'express';
import { signUpUser, signInUser } from '../controllers/userControllers.js';

const router = express.Router();

router.post('/sign-up', signUpUser);
router.post('/sign-in', signInUser);

export default router;