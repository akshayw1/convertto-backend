import express from "express";
import { verifyAdmin } from "./../middleware/verifyAdmin.js";
import { createPlan, deletePlan, getAllPlans, getPlan, updatePlan } from "../controller/plans.controllers.js";

const router = express.Router();

router.post("/add",verifyAdmin,createPlan);
router.delete("/delete/:id",verifyAdmin,deletePlan);
router.get("/:id",getPlan);
router.get("/",getAllPlans);
router.post("/update/:id",updatePlan);

export default router;