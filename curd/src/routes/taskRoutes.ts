import { Router } from "express";
import {
  CreateTask,
  deleteTask,
  getTask,
  getTaskById,
  updateTask,
} from "../controllers/taskController";
import { Protect, restrictTo } from "../midleware/Protect";

const router = Router();

router.post("/createTask", Protect, restrictTo("Admin"), CreateTask);

router.get("/getTask", Protect, restrictTo("Admin", "Manager"), getTask);

router.get("/getTaskById", Protect, restrictTo("User"), getTaskById);

router.delete("/deleteTask", Protect, restrictTo("Admin"), deleteTask);

router.put("/updateTask", Protect, restrictTo("Manager"), updateTask);

export default router;
