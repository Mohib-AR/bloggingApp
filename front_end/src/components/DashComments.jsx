import React, { useEffect, useState } from "react";
import { Table, Modal, Button } from "flowbite-react";
import { useSelector } from "react-redux";
import { HiOutlineExclamationCircle } from "react-icons/hi";
export default function DashComments() {
  const { currentuser } = useSelector((store) => store.user);
  const [comments, setComments] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [showModel, setShowModel] = useState(false);
  const [commentId, setCommentId] = useState(null);
  const getAllComments = async () => {
    if (!currentuser.isAdmin) return;
    try {
      const res = await fetch("/api/comment/getAllComments", {
        method: "GET",
      });
      if (res.ok) {
        const data = await res.json();
        if (data.comments.length > 9) setShowMore(true);
        setComments(data.comments);
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  const handleDeleteComment = async () => {
    setShowModel(false);
    if (!currentuser.isAdmin) return;
    try {
      const res = await fetch(`/api/comment/deleteComment/${commentId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        const data = await res.json();
        setComments((prev) =>
          prev.filter((comment) => comment._id !== commentId)
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  const handleShowMore = async () => {
    const startIndex = comments.length;
    try {
      const res = await fetch(
        `/api/comment/getAllComments?startIndex=${startIndex}`
      );
      const data = await res.json();
      if (res.ok) {
        setComments((prev) => [...prev, ...data.comments]);
        if (data.comments.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  useEffect(() => {
    getAllComments();
  }, [comments]);
  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3  md:pl-10 sm:mt-6 mb-20 md:mb-0 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      <Table hoverable className="shadow-md">
        <Table.Head>
          <Table.HeadCell>Date updated</Table.HeadCell>
          <Table.HeadCell>Comment Content</Table.HeadCell>
          <Table.HeadCell>Number of Likes</Table.HeadCell>
          <Table.HeadCell>Post ID</Table.HeadCell>
          <Table.HeadCell>User ID</Table.HeadCell>
          <Table.HeadCell>
            <p>Delete</p>
          </Table.HeadCell>
        </Table.Head>
        {comments &&
          comments?.length > 0 &&
          comments.map((comment) => (
            <Table.Body className="divide-y" key={comment._id}>
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell>
                  {new Date(comment.updatedAt).toLocaleDateString()}
                </Table.Cell>
                <Table.Cell>{comment.content}</Table.Cell>
                <Table.Cell>{comment.numberOfLikes}</Table.Cell>
                <Table.Cell>{comment.postId}</Table.Cell>
                <Table.Cell>{comment.userId}</Table.Cell>
                <Table.Cell>
                  <span
                    className="text-red-500 hover:underline cursor-pointer font-medium"
                    onClick={() => {
                      setCommentId(comment._id);
                      setShowModel(true);
                    }}
                  >
                    Delete
                  </span>
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          ))}
      </Table>
      {showMore && (
        <button
          onClick={handleShowMore}
          className="w-full text-teal-500 self-center text-sm py-7"
        >
          Show more
        </button>
      )}
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
            Are you sure you want ot delete this comment?
          </h1>
          <div className="flex justify-between">
            <Button color="failure" onClick={handleDeleteComment}>
              Yes I'm sure
            </Button>
            <Button color="gray" onClick={() => setShowModel(false)}>
              No, cancel
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
