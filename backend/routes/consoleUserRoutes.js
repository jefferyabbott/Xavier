import { Router } from 'express';
const router = Router();
import { registerUser, loginUser } from '../controllers/userController.js';

// uncomment the register route when creating the first user account
// after the first user account is created, comment out the register route to prevent people from creating their own accounts
// router.post('/register', registerUser);

router.post('/login', loginUser);

export default router;
