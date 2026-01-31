import { Router } from "express";
import { protect } from "../middleware/auth.middleware";
import {
  getUsers,
  getUserProfile,
  updateProfile,
} from "../controllers/user.controller";

const router = Router();

// All user routes are protected
router.use(protect);

router.get("/", getUsers);
router.get("/profile", getUserProfile);
router.put("/profile", updateProfile);

export default router;
