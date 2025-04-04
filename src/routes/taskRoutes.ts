import { Router } from "express";
import {
  CreateTask,
  deleteTask,
  getTask,
  getTaskById,
} from "../controllers/taskController";
import { Protect } from "../midleware/Protect";

const router = Router();

router.post("/createTask", Protect, CreateTask);

router.get("/getTask", Protect, getTask);

router.get("/getTaskById", Protect, getTaskById);

router.delete("/deleteTask", Protect, deleteTask);

export default router;
