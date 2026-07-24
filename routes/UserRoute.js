import express from 'express'
import { createUser, getUser, loginUser, googleAuth, githubAuth } from '../controllers/UserController.js';
import { verifyUser } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post("/createUser", createUser)
router.post("/loginUser", loginUser)
router.get("/getUser", verifyUser, getUser)
router.post("/google", googleAuth)
router.post("/github", githubAuth)


export default router;