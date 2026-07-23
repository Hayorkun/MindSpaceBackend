import express from "express"
import { createTask, deleteTask, getTask, updateTask } from "../controllers/TaskController.js"
import { verifyUser } from "../middleware/authMiddleware.js"

const router = express.Router()

router.post("/createTask", verifyUser, createTask)
router.get("/getTask", verifyUser, getTask)
router.patch("/updateTask/:id", verifyUser, updateTask)
router.delete("/deleteTask/:id", verifyUser, deleteTask )

export default router