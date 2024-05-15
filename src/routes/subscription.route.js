import express from "express";
import { addSubcriptionToUser, stripeCancel, stripeSuccess } from "../controller/user.subscription.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/create-checkout-session/:id",verifyToken,addSubcriptionToUser);
router.post("/test",(req,res)=>{
    res.send({message:"Hello"});
})
router.get('/success', stripeSuccess);
router.get('/cancel', stripeCancel);

export default router;