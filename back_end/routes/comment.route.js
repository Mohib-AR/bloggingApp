import express from "express";
const router = express.Router();
import {
  createComment,
  getPostComments,
  likeComment,
  editComment,
  deleteComment,
  getAllComments,
} from "../controllers/comment.controller.js";
import { verifyUser } from "../utils/verifyUser.js";

router.post("/create", verifyUser, createComment);
router.get("/getPostComments/:postId", getPostComments);
router.put("/likeComment/:commentId", verifyUser, likeComment);
router.put("/editComment/:commentId", verifyUser, editComment);
router.delete("/deleteComment/:commentId", verifyUser, deleteComment);
router.get("/getAllComments", verifyUser, getAllComments);
export default router;
