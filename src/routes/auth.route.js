import express from "express";
import { loginUser, logoutUser, registerUser } from "../controller/auth.controller.js";

const router = express.Router();

router.post("/login",loginUser);
router.post("/register",registerUser);
router.post("/logout",logoutUser);
// router.post("/",test)

export default router;