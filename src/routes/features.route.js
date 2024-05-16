import express from "express";
import { addfeatures, generateConfigjson, getFeaturesByApp } from "../controller/features.apps.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";


const router = express.Router();

router.post("/add/:appId",verifyToken,addfeatures);
router.get("/test",(req,res)=>{
    res.json({message:"Route running ok"})
})
router.get("/:appId",verifyToken,getFeaturesByApp);
router.get("/generate/:appId",generateConfigjson);


export default router;

