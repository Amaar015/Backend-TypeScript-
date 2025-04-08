import { Router } from "express";
import {
  CreateTask,
  deleteTask,
  getTask,
  getTaskById,
  updateTask,
} from "../controllers/taskController";
import { Protect, restrictTo } from "../midleware/Protect";
import {
  CreateTasks,
  deleteTasks,
  getTaskByIds,
  getTasks,
  updateTasks,
} from "../controllers/TaskControllers";
import { Protects } from "../midleware/Auth";

const router = Router();

// Sequelize

router.post(
  "/createTask-sequelize",
  Protects,
  restrictTo("Admin"),
  CreateTasks
);

router.get(
  "/getTask-sequelize",
  Protect,
  restrictTo("Admin", "Manager"),
  getTasks
);

router.get(
  "/getTaskById-sequelize",
  Protects,
  restrictTo("User"),
  getTaskByIds
);

router.delete(
  "/deleteTask-sequelize",
  Protects,
  restrictTo("Admin"),
  deleteTasks
);

router.put(
  "/updateTask-sequelize",
  Protects,
  restrictTo("Manager"),
  updateTasks
);

export default router;
