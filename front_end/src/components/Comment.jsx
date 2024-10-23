import React, { useEffect, useState } from "react";
import moment from "moment";
import { useSelector } from "react-redux";
import { FaThumbsUp } from "react-icons/fa";
import { Textarea, Button, Modal } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
export default function Comment({
  comment,
  onLike,
  saveEditedContent,
  handleDeletePost,
}) {
  if (!comment) return;
  const [userData, setUserData] = useState([]);
  const { currentuser } = useSelector((store) => store.user);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const [showModel, setShowModel] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`/api/user/${comment.userId}`);
        const data = await res.json();
        if (res.ok) {
          setUserData(data);
        }
      } catch (error) {}
    };
    getUser();
  }, [comment.userId]);
  const handleSave = async () => {
    try {
      const res = await fetch(`/api/comment/editComment/${comment._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ editedContent }),
      });
      if (res.ok) {
        console.log("response is ok");
        saveEditedContent(comment, editedContent);
        setIsEditing(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="flex p-4 border-b text-sm  dark:border-gray-600 ">
        <div className="flex-shrink-0 mr-3">
          <img
            src={userData.photoUrl}
            alt="user"
            className="w-6 h-6 rounded-full"
          />
        </div>
        <div className="flex-1 ">
          <div className="flex items-center mb-3 gap-2">
            <span className="mr-1 font-bold text-xs truncate">
              {userData?.username ? `@${userData.username}` : "anonymous user"}
            </span>
            <span className="text-xs text-gray-500">
              {moment(comment.createdAt).fromNow()}
            </span>
          </div>
          {isEditing ? (
            <>
              <Textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
              />
              <div className="flex text-xs justify-end gap-2 mt-4">
                <Button
                  size={"sm"}
                  gradientDuoTone={"purpleToBlue"}
                  onClick={handleSave}
                >
                  Save
                </Button>
                <Button
                  size={"sm"}
                  gradientDuoTone={"purpleToBlue"}
                  outline
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
              </div>
            </>
          ) : (
            <>
              <p className="test-gray-500 mb-4 "> {comment.content}</p>
              <div className="flex gap-2">
                <button
                  type="button"
                  className={`text-sm text-gray-400 hover:text-blue-500 ${
                    currentuser && comment.likes.includes(currentuser._id)
                      ? "!text-blue-500"
                      : null
                  }`}
                  onClick={() => onLike(comment._id)}
                >
                  <FaThumbsUp />
                </button>
                <p>{comment.numberOfLikes > 0 && comment.numberOfLikes}</p>
                {currentuser &&
                  (currentuser._id == comment.userId ||
                    currentuser.isAdmin) && (
                    <div className="flex gap-3 ml-4">
                      <button
                        onClick={() => {
                          setIsEditing(true);
                          setEditedContent(comment.content);
                        }}
                        type="button"
                        className="text-gray-400 hover:text-blue-500"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          setShowModel(true);
                        }}
                        type="button"
                        className="text-gray-400 hover:text-red-500"
                      >
                        Delete
                      </button>
                    </div>
                  )}
              </div>
            </>
          )}
        </div>
        <Modal
          show={showModel}
          size={"md"}
          onClose={() => setShowModel(false)}
          popup
        >
          <Modal.Header />
          <Modal.Body>
            <div className="text-center">
              <HiOutlineExclamationCircle className="w-14 mb-4 h-14 text-gray-600 dark:text-gray-400 mx-auto " />
            </div>
            <h1 className="sm:text-lg text-center text-gray-500 mb-10 ">
              Are you sure you want ot delete this account permanently?
            </h1>
            <div className="flex justify-between">
              <Button
                color="failure"
                  onClick={() => {
                    handleDeletePost(comment._id);
                    setShowModel(false);
                  }}
              >
                Yes I'm sure
              </Button>
              <Button color="gray" onClick={() => setShowModel(false)}>
                No, cancel
              </Button>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
}
