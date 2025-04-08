import { Router } from "express";
import { searchTask } from "../controllers/searchController";

const router = Router();

router.get("/task", searchTask);

export default router;
