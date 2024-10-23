import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Table, Modal, Button, Alert } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { FaCheck, FaTimes } from "react-icons/fa";

export default function DashPosts() {
  const { currentuser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModel, setShowModel] = useState(false);
  const [userId, setUserId] = useState("");
  const [errMsg, setErrMsg] = useState(null);
  const handleDeleteUser = async () => {
    setShowModel(false);
    try {
      const res = await fetch(`/api/user/delete/${userId}`, {
        method: "DELETE",
      });
      const data = res.json();
      if (res.ok) {
        setUsers((prevUser) => prevUser.filter((user) => user._id !== userId));
      }
      if (!res.ok) {
        setErrMsg(data.msg);
      }
    } catch (error) {
      setErrMsg(error.message);
    }
  };
  const getAllUsers = async () => {
    const res = await fetch(`/api/user/getusers`);

    const data = await res.json();
    if (res.ok) {
      setUsers(data.users);
      if (data.users.length < 9) setShowMore(false);
    }
  };
  const handleShowMore = async () => {
    const startIndex = users.length;
    const res = await fetch(`/api/user/getusers?startIndex=${startIndex}`);
    const data = await res.json();
    if (res.ok) {
      setUsers((prevPost) => [...prevPost, ...data.users]);

      if (data.users.length < 9) setShowMore(false);
    }
  };
  useEffect(() => {
    if (currentuser.isAdmin) getAllUsers();
  }, [currentuser._id]);

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto pt-12 p-3   scrollbar-track-slate-100 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500 scrollbar-thumb-slate-300 scrollbar">
      {currentuser.isAdmin && users.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date created</Table.HeadCell>
              <Table.HeadCell>User image</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>Admin</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            {users.map((user) => (
              <Table.Body className="divide-y" key={user._id}>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <img
                      src={user.photoUrl}
                      alt={user.title}
                      className="w-12 h-12 object-cover rounded-full"
                    />
                  </Table.Cell>
                  <Table.Cell>{user.username}</Table.Cell>
                  <Table.Cell>{user.email}</Table.Cell>
                  <Table.Cell>
                    {user.isAdmin ? (
                      <FaCheck className="text-green-500" />
                    ) : (
                      <FaTimes className="text-red-500" />
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    <span
                      onClick={() => {
                        setShowModel(true);
                        setUserId(user._id);
                      }}
                      className="text-red-500 hover:underline cursor-pointer font-medium"
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
              className="w-full text-teal-500 self-center py-7
            "
              onClick={handleShowMore}
            >
              Show more
            </button>
          )}
        </>
      ) : (
        <p>There is no user to show</p>
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
            Are you sure you want to delete this user permanently?
          </h1>
          <div className="flex justify-between">
            <Button color="failure" onClick={handleDeleteUser}>
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
