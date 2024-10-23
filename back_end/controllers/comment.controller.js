import Comment from "../models/comment.model.js";
import errorHandler from "../utils/errorHandler.js";
const createComment = async (req, res, next) => {
  try {
    if (!req.body.content || !req.body.userId || !req.body.postId)
      next(errorHandler(400, "Please fill out all fields"));
    if (req.body.userId != req.user.id)
      next(errorHandler(403, "You are unauthorised for this action"));
    const newComment = new Comment({
      content: req.body.content,
      postId: req.body.postId,
      userId: req.body.userId,
    });
    await newComment.save();
    res.status(200).json(newComment);
  } catch (error) {
    next(error);
  }
};

const getPostComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId }).sort({
      createdAt: -1,
    });
    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};

const getAllComments = async (req, res, next) => {
  if (!req.user.isAdmin)
    return next(errorHandler(403, "You are not allowed to get all comments"));
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === "desc" ? -1 : 1;
    const comments = await Comment.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);
    const totalComments = await Comment.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthsComments = await Comment.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });
    res.status(200).json({ comments, totalComments, lastMonthsComments });
  } catch (error) {
    next(error);
  }
};

const likeComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) return next(errorHandler(404, "Not found Comment"));
    const userIndex = comment.likes.indexOf(req.user.id);
    if (userIndex == -1) {
      comment.numberOfLikes += 1;
      comment.likes.push(req.user.id);
    } else {
      comment.numberOfLikes -= 1;
      comment.likes.splice(userIndex, 1);
    }
    await comment.save();
    res.status(200).json(comment);
  } catch (error) {
    next(error);
  }
};

const editComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) return next(errorHandler(404, "Not found Comment!"));
    if (req.user.id != comment.userId && !req.user.isAdmin)
      return next(errorHandler(403, "You are unauthorised for the action!"));

    const editedComment = await Comment.findByIdAndUpdate(
      req.params.commentId,
      {
        content: req.body.content,
      },
      { new: true }
    );
    res.status(200).json(editedComment);
  } catch (error) {
    next(error);
  }
};
const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    console.log(comment);
    if (!comment) return next(errorHandler(404, "Not found Comment!"));
    if (req.user.id != comment.userId && !req.user.isAdmin)
      return next(errorHandler(403, "You are unauthorised for the action!"));

    const deletedComment = await Comment.findByIdAndDelete(
      req.params.commentId
    );
    res.status(200).json("Comment has been deleted");
  } catch (error) {
    next(error);
  }
};

export {
  createComment,
  getPostComments,
  likeComment,
  editComment,
  deleteComment,
  getAllComments,
};
