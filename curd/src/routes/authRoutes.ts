import { Router } from "express";
import { Login, Register } from "../controllers/authController";

const router = Router();

router.post("/register", Register); // ✅ Correct
router.post("/login", Login); // ✅ Correct

export default router;
