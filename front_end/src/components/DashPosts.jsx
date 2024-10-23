import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Table, Modal, Button, Alert } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
export default function DashPosts() {
  const { currentuser } = useSelector((state) => state.user);
  const [userPost, setUserPost] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModel, setShowModel] = useState(false);
  const [postId, setPostId] = useState("");
  const [errMsg, setErrMsg] = useState(null);
  const handleDeletePost = async () => {
    setShowModel(false);
    try {
      const res = await fetch(
        `/api/post/deletepost/${postId}/${currentuser._id}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (res.ok) {
        setUserPost((prevPost) =>
          prevPost.filter((post) => post._id != postId)
        );
        setErrMsg(null);
      }
      if (!res.ok) {
        setErrMsg(data.msg + "some error occured");
      }
    } catch (error) {
      setErrMsg("some error occured");
    } finally {
      setErrMsg(null);
    }
  };
  const getAllPosts = async () => {
    const res = await fetch(`/api/post/getPosts?userId=${currentuser._id}`);

    const data = await res.json();
    if (res.ok) {
      setUserPost(data.posts);
      if (data.posts.length < 9) setShowMore(false);
    }
  };
  const handleShowMore = async () => {
    const startIndex = userPost.length;
    const res = await fetch(
      `/api/post/getPosts?userId=${currentuser._id}&startIndex=${startIndex}`
    );
    const data = await res.json();
    if (res.ok) {
      setUserPost((prevPost) => [...prevPost, ...data.posts]);

      if (data.posts.length < 9) setShowMore(false);
    }
  };
  useEffect(() => {
    if (currentuser.isAdmin) getAllPosts();
  }, [currentuser._id]);

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto pt-12 p-3   scrollbar-track-slate-100 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500 scrollbar-thumb-slate-300 scrollbar">
      {currentuser.isAdmin && userPost.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date updated</Table.HeadCell>
              <Table.HeadCell>Post image</Table.HeadCell>
              <Table.HeadCell>Post title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>
                <p>Edit</p>
              </Table.HeadCell>
            </Table.Head>
            {userPost.map((post) => (
              <Table.Body className="divide-y" key={post._id}>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>
                    {new Date(post.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/post/${post.slug}`}>
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-20 h-16 object-cover "
                      />
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/post/${post.slug}`}>{post.title}</Link>
                  </Table.Cell>
                  <Table.Cell>{post.category}</Table.Cell>
                  <Table.Cell>
                    <span
                      onClick={() => {
                        setShowModel(true);
                        setPostId(post._id);
                      }}
                      className="text-red-500 hover:underline cursor-pointer font-medium"
                    >
                      Delete
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/update-post/${post._id}`}>
                      <span className="text-teal-500 hover:underline cursor-pointer font-medium">
                        Edit
                      </span>
                    </Link>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
          {showMore && (
            <button
              className="w-full text-teal-500 self-center py-7
            "
              onClick={handleShowMore}
            >
              Show more
            </button>
          )}
        </>
      ) : (
        <p>There is no post to show</p>
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
            Are you sure you want ot delete this account permanently?
          </h1>
          <div className="flex justify-between">
            <Button color="failure" onClick={handleDeletePost}>
              Yes I'm sure
            </Button>
            <Button color="gray" onClick={() => setShowModel(false)}>
              No, cancel
            </Button>
          </div>
        </Modal.Body>
      </Modal>
      {errMsg && <Alert color={"failure"}>{errMsg}</Alert>}
    </div>
  );
}
