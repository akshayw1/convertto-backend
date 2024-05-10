import express from "express";
import { verifyAdmin } from "./../middleware/verifyAdmin.js";
import { createPlan, deletePlan, getPlan } from "../controller/plans.controllers.js";

const router = express.Router();

router.post("/add",verifyAdmin,createPlan);
router.get("/delete/:id",deletePlan);
router.get("/:id",getPlan);


export default router;