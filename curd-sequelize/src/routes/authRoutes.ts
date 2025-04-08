import { Router } from "express";
import { Login, Register } from "../controllers/authController";
import { Logins, Registers } from "../controllers/AuthControllers";
const router = Router();


// sequelize routes
router.post("/signup", Registers);
router.post("/signout", Logins);
export default router;
