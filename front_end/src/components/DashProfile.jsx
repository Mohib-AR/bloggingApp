import React, { useEffect, useRef, useState } from "react";
import { TextInput, Button, Alert, Modal } from "flowbite-react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { app } from "../firebase";
import {
  updateFailure,
  updateStart,
  updateSuccess,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signoutSuccess,
} from "../redux/user/userSlice.js";
import { useDispatch } from "react-redux";

export default function DashProfile() {
  const filePickerRef = useRef();
  const [showModel, setShowModel] = useState(false);
  const { currentuser, error, loading } = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [updateUserFailure, setUpdateUserFailure] = useState(null);

  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  async function handleSubmit(e) {
    e.preventDefault();
    setUpdateUserFailure(null);
    setUpdateUserSuccess(null);
    if (imageFileUploading) return setUpdateUserFailure("Image is uploading!");
    if (Object.keys(formData).length === 0)
      return setUpdateUserFailure("No changes made!");

    try {
      dispatch(updateStart());
      const res = await fetch(`/api/user/update/${currentuser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const user = await res.json();

      if (res.ok) {
        dispatch(updateSuccess(user));
        setUpdateUserSuccess("Users profile updated successfully");
      } else {
        dispatch(updateFailure(user.msg));
        setUpdateUserFailure(user.msg);
      }
    } catch (err) {
      dispatch(updateFailure(err.message));
      setUpdateUserFailure(err.message);
    }
  }
  function handleInputChange(e) {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  }

  function handleChange(e) {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  }
  const uploadImage = async () => {
    setImageFileUploading(true);
    setImageFileUploadError(null);

    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setImageFileUploadError(
          "Could not upload image (File must be less than 2MB)"
        );
        setImageFileUploading(false);
        setImageFileUploadProgress(null);
        setImageFile(null);
        setImageFileUrl(null);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
          setFormData({ ...formData, photoUrl: downloadURL });
          setImageFileUploading(false);
        });
      }
    );
  };
  const handleDeleteUser = async () => {
    setShowModel(false);
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentuser._id}`, {
        method: "DELETE",
      });
      const data = res.json();
      if (res.ok) {
        dispatch(deleteUserSuccess());
      } else {
        dispatch(deleteUserFailure(data.message));
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };
  const handleSignout = async () => {
    try {
      const res = await fetch("/api/user/signout", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        dispatch(signoutSuccess());
      } else {
      }
    } catch (error) {}
  };
  useEffect(() => {
    if (imageFile) uploadImage();
  }, [imageFile]);

  return (
    <div className="mt-8 max-w-lg p-3 mx-auto w-full">
      <h1 className="font-semibold text-lg text-center">Profile</h1>
      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <div className="w-32 h-32 self-center shadow-md rounded-full relative">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleChange}
            ref={filePickerRef}
          />
          <div
            onClick={() => {
              console.log("clicking");
              filePickerRef.current.click();
            }}
          >
            {imageFileUploadProgress && (
              <CircularProgressbar
                value={imageFileUploadProgress || 0}
                text={`${imageFileUploadProgress}%`}
                strokeWidth={5}
                styles={{
                  root: {
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                    top: 0,
                    left: 0,
                  },
                  path: {
                    stroke: `rgba(62, 152, 199, ${
                      imageFileUploadProgress / 100
                    })`,
                  },
                }}
              />
            )}
          </div>

          <img
            onClick={() => {
              console.log("clicking");
              filePickerRef.current.click();
            }}
            src={imageFileUrl || currentuser.photoUrl}
            alt="userImage"
            className="rounded-full w-full h-full object-cover border-8 border-[lightgray]"
          />
        </div>
        {imageFileUploadError && (
          <Alert color="failure">{imageFileUploadError}</Alert>
        )}
        <TextInput
          type="text"
          id="username"
          placeholder="username"
          defaultValue={currentuser.username}
          onChange={handleInputChange}
        />
        <TextInput
          type="email"
          id="email"
          placeholder="email"
          defaultValue={currentuser.email}
          onChange={handleInputChange}
        />
        <TextInput
          type="password"
          id="password"
          placeholder="password"
          onChange={handleInputChange}
        />
        <Button
          type="submit"
          outline
          gradientDuoTone={"purpleToBlue"}
          disabled={loading || imageFileUploading}
        >
          {loading ? "Loading..." : "Update"}
        </Button>
        {currentuser.isAdmin && (
          <Link to="/create-post">
            <Button gradientDuoTone={"purpleToPink"} className="w-full">
              Create a post
            </Button>
          </Link>
        )}
        <div className="text-red-500 flex justify-between text-sm md:text-base cursor-pointer mt-3">
          <span onClick={() => setShowModel(true)}>Delete account</span>
          <span onClick={handleSignout}>Sign out</span>
        </div>
      </form>
      <div>
        {updateUserSuccess && (
          <Alert color="success" className="mt-6">
            {updateUserSuccess}
          </Alert>
        )}
        {(updateUserFailure || error) && (
          <Alert color="failure" className="mt-6">
            {updateUserFailure || error}
          </Alert>
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
            <h1 className="text-lg text-center text-gray-500 mb-10">
              Are you sure you want ot delete this account permanently?
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
      </div>
    </div>
  );
}
