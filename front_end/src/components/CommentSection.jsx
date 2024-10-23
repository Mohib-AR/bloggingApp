import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Textarea, Button, Alert } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import Comment from "./Comment";
export default function CommentSection({ postId }) {
  const navigate = useNavigate();
  const { currentuser } = useSelector((store) => store.user);
  const [comment, setComment] = useState("");
  const [error, setError] = useState(null);
  const [value, setValue] = useState(200);
  const [postComments, setPostComments] = useState([]);
  const handleChange = (e) => {
    setComment(e.target.value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/comment/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: comment,
          userId: currentuser?._id,
          postId,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setComment("");
        setError(null);
        setPostComments([data, ...postComments]);
      }
      if (!res.ok) {
        setError(data.msg);
      }
    } catch (error) {
      setError("Some error occured" + error.message);
    }
  };
  useEffect(() => {
    const getComments = async () => {
      try {
        const res = await fetch(`/api/comment/getPostComments/${postId}`);
        if (res.ok) {
          const data = await res.json();
          setPostComments(data);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    getComments();
  }, [postId]);
  const saveEditedContent = (comment, editedContent) => {
    setPostComments((prevComment) =>
      prevComment.map((comment1) =>
        comment1._id == comment._id
          ? { ...comment1, content: editedContent }
          : comment1
      )
    );
  };
  const handleDeletePost = async (commentId) => {
    if (!currentuser) return navigate("/sign-in");
    try {
      const res = await fetch(`/api/comment/deleteComment/${commentId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        const data = await res.json();
        setPostComments((prevComment) =>
          prevComment.filter((comment1) => comment1._id !== commentId)
        );
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleLike = async (commentId) => {
    try {
      if (!currentuser) {
        navigate("/sign-in");
        return;
      }
      const res = await fetch(`/api/comment/likeComment/${commentId}`, {
        method: "PUT",
      });
      if (res.ok) {
        const data = await res.json();
        setPostComments((prevComments) =>
          prevComments.map((comment) =>
            comment._id === commentId
              ? {
                  ...comment,
                  likes: data.likes,
                  numberOfLikes: data.likes.length,
                }
              : comment
          )
        );
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="mt-2 mx-auto max-w-2xl w-full p-3">
      {currentuser ? (
        <div className="flex gap-2 items-center my-5 text-sm text-gray-500">
          <p>Signed in as </p>
          <img
            src={currentuser.photoUrl}
            alt="userPhoto"
            className="w-6 h-6 object-cover rounded-full"
          />
          <Link to={"/dashboard?tab=profile"} className="text-cyan-600">
            @{currentuser.username}
          </Link>
        </div>
      ) : (
        <div className="flex gap-3 text-sm">
          <h3>You must sign in for comment</h3>
          <Link
            to={"/sign-in"}
            className="cursor-pointer hover:underline text-teal-600"
          >
            Sign in
          </Link>
        </div>
      )}
      <div>
        {currentuser && (
          <form
            onSubmit={handleSubmit}
            className="border border-teal-500 rounded-md p-3"
          >
            <Textarea
              maxLength="200"
              placeholder="Add a comment ..."
              rows={3}
              onChange={handleChange}
              value={comment}
            />
            <div className="flex justify-between items-center mt-5">
              <p className="text-gray-500 text-sm">
                {200 - comment.length} characters left
              </p>
              <Button type="submit" gradientDuoTone={"purpleToBlue"} outline>
                Submit
              </Button>
            </div>
          </form>
        )}
      </div>
      {error && <Alert color="failure">{error}</Alert>}
      {postComments.length == 0 ? (
        <p className="text-sm my-5">No comments yet!</p>
      ) : (
        <>
          <div className="flex items-center gap-1 text-sm my-5">
            <p>Comments</p>
            <div className="border border-gray-4 py-1 px-2 rounded-sm ">
              <p>{postComments.length}</p>
            </div>
          </div>

          {postComments &&
            postComments?.map((comment) => (
              <Comment
                key={comment?._id}
                comment={comment}
                onLike={handleLike}
                saveEditedContent={saveEditedContent}
                handleDeletePost={handleDeletePost}
              />
            ))}
        </>
      )}
    </div>
  );
}
