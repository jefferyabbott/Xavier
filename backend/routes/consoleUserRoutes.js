import { Router } from 'express';
const router = Router();
import { registerUser, loginUser, createNewUser } from '../controllers/userController.js';
import protect from '../middleware/authHandler.js';

// uncomment the register route when creating the first user account
// after the first user account is created, comment out the register route to prevent people from creating their own accounts
// router.post('/register', registerUser);

router.post('/login', loginUser);
router.post('/createNewUser', protect, createNewUser);

export default router;
