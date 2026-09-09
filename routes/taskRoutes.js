import express from "express";
import { createTask, deleteTask, editTask, getTasksByUserAndDate, updateTaskState, getTaskById } from "../controllers/taskController.js";
import { isVerifiedUser } from "../middlewares/tokenVerification.js";




const router = express.Router();

router.get("/tasks", isVerifiedUser(), getTasksByUserAndDate);
router.get("/tasks/:taskId", getTaskById);
router.delete("/tasks/:taskId", deleteTask);// passing as parameter
router.patch("/tasks/:taskId/state/:state", updateTaskState); // complete or incomplete route
router.post("/tasks",isVerifiedUser(), createTask);
router.put("/tasks/:taskId", isVerifiedUser(), editTask);
// http://localhost:5000/api/task/tasks
export default router;