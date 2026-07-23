import express from 'express'
import { createUser, loginUser } from '../controllers/UserController.js';
import { createTask } from '../controllers/TaskController.js';
import { verifyUser } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post("/createUser", createUser)
router.post("/loginUser", loginUser)
router.post("/createTask", verifyUser, createTask)

export default router;