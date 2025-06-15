import express from "express";
import { registerUser, loginUser, refreshToken } from "../controllers/user.controller.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refreshToken", refreshToken);

export const userRouter = router;