import express from "express";
import { createApp } from "./../controller/apps.controller.js";
import { verifyToken } from "./../middleware/verifyToken.js";

const router = express.Router();

router.post('/createapp',verifyToken,createApp);


export default router;