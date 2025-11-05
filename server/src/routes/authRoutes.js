import express from "express";
const router = express.Router();
import { login,signup,logout,onboard } from "../controller/authController.js";
import protect from "../middleware/middleware.js";


router.post('/signup',signup);
router.post('/login',login);
router.post('/logout',logout)
router.post('/onboarding',protect,onboard);

router.get('/me',protect,(req,res)=>{
    res.status(200).json({user:req.user});
});

export default router;