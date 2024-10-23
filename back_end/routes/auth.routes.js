import express from "express";
const router = express.Router();
import {
  signup,
  signin,
  googleSignIn,
} from "../controllers/auth.controller.js";

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/google", googleSignIn);

export default router;
