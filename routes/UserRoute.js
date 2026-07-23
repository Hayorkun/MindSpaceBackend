import express from 'express'
import { createUser, getUser, loginUser } from '../controllers/UserController.js';
import { verifyUser } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post("/createUser", createUser)
router.post("/loginUser", loginUser)
router.get("/getUser", verifyUser, getUser)

export default router;