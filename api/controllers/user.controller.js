import errorHandler from "../utils/errorHandler.js";
import User from "../models/user.model.js";

const updateUser = async (req, res, next) => {
  if (req.user.id != req.params.userId) {
    return next(errorHandler(401, "Unauthorized user"));
  }
  if (req.body.username) {
    if (req.body.username.length < 6 || req.body.username.length > 20)
      return next(
        errorHandler(400, "username should be greater than 6 and less than 20")
      );

    if (req.body.username.includes(" "))
      return next(errorHandler(400, "whitespaces are not allowed in username"));

    if (!req.body.username.match(/^[a-zA-Z0-9]+$/))
      return next(
        errorHandler(400, "username can only contain letters and numbers")
      );
  }

  if (req.body.password) {
    if (req.body.password.length < 6) {
      return next(
        errorHandler(400, "req.body.password should be greater than 6")
      );
    }
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      {
        $set: {
          username: req?.body?.username,
          email: req?.body?.email,
          password: req?.body?.password,
          photoUrl: req?.body?.photoUrl,
        },
      },
      { new: true }
    );

    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    console.log("In error");
    console.log(error);
  }
};

const deleteUser = async (req, res, next) => {
  if (!req.user.isAdmin && req.params.userId !== req.user.id) {
    return next(errorHandler(403, "You are not auhtorized for this action"));
  }
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.userId);
    res.status(200).json("User has been deleted successfully!");
  } catch (error) {
    next(error);
  }
};
const signOut = (req, res, next) => {
  try {
    res.clearCookie("access_token").status(200).json("Signed out Successfully");
  } catch (error) {
    next(error);
  }
};
const getUser = async (req, res, next) => {
  if (!req.user.isAdmin)
    return next(errorHandler(403, "You are not allowed to get users"));
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === "asc" ? 1 : -1;
    const users = await User.find({})
      .sort({ createddAt: sortDirection })
      .skip(startIndex)
      .limit(limit)
      .exec();

    const usersWithoutPassword = users.map((user) => {
      const { password, ...rest } = user._doc;
      return rest;
    });
    const totalUsers = await User.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthsUsers = await User.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });
    res.status(200).json({
      users: usersWithoutPassword,
      totalUsers,
      lastMonthsUsers,
    });
  } catch (error) {
    next(error);
  }
};

const getUserForComments = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return next(errorHandler(404, "User not found!"));
    }
    const { password, ...rest } = user._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export { updateUser, deleteUser, signOut, getUser, getUserForComments };
