import express from "express";
import { createApp, deleteApp, getAppforUser } from "./../controller/apps.controller.js";
import { verifyToken } from "./../middleware/verifyToken.js";
import { checkAppCreationAccess } from "../middleware/checkAppCreationAccess.js";

const router = express.Router();

router.post('/create',verifyToken,checkAppCreationAccess,createApp);
router.post('/delete/:id',verifyToken,deleteApp);
router.get('/',verifyToken,getAppforUser);


export default router;