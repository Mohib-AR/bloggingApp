import express from "express";
import {
  deleteUser,
  updateUser,
  signOut,
  getUser,
  getUserForComments,
} from "../controllers/user.controller.js";
import { verifyUser } from "../utils/verifyUser.js";
const router = express.Router();

router.put("/update/:userId", verifyUser, updateUser);
router.delete("/delete/:userId", verifyUser, deleteUser);
router.post("/signout", signOut);
router.get("/getusers", verifyUser, getUser);
router.get("/:userId", getUserForComments);
export default router;
