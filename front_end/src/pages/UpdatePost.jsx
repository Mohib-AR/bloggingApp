import React, { useEffect, useState } from "react";
import {
  TextInput,
  Select,
  FileInput,
  Button,
  Alert,
  Spinner,
} from "flowbite-react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import ReactQuill from "react-quill";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import { app } from "../firebase";
import "react-quill/dist/quill.snow.css";
export default function CreatePost() {
  const navigate = useNavigate();
  const { postId } = useParams();
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const { currentuser } = useSelector((state) => state.user);

  const fetchPostDetail = async () => {
    try {
      const res = await fetch(`/api/post/getPosts?postId=${postId}`);
      const data = await res.json();
      if (!res.ok) {
        console.log(data.msg);
        return;
      }
      if (res.ok) {
        setFormData(data.posts[0]);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const updatePost = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `/api/post/updatepost/${formData._id}/${currentuser._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.msg);
        return;
      }
      if (res.ok) {
        console.log(data);
        setPublishError(null);
        navigate(`/post/${data.slug}`);
      }
    } catch (error) {
      setPublishError("something went wrong");
    }
  };

  useEffect(() => {
    fetchPostDetail();
  }, [postId]);
  const uploadImage = async () => {
    try {
      if (!file) {
        setImageUploadError("Please Select an Image");
        return;
      }
      const storage = getStorage(app);
      const fileName = new Date().getTime() + "-" + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setImageUploadError("File couldnot be uploaded");
          setImageUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadError(null);
            setImageUploadProgress(null);
            setFormData((prevFormData) => ({
              ...prevFormData,
              image: downloadURL,
            }));
          });
        }
      );
    } catch (error) {
      setImageUploadError("File couldnot be uploaded");
      setImageUploadProgress(null);
    }
  };

  return (
    <div className="min-h-screen mt-10 mx-auto max-w-2xl p-4">
      <h1 className="text-center text-3xl font-semibold mb-8">Update a post</h1>
      <form className="flex flex-col gap-4" onSubmit={updatePost}>
        <div className=" flex flex-col sm:flex-row gap-4">
          <TextInput
            type="text"
            placeholder="Title"
            id="title"
            required
            value={formData.title}
            className="flex-1"
            onChange={(e) => {
              setFormData({ ...formData, title: e.target.value });
            }}
          ></TextInput>
          <Select
            onChange={(e) => {
              setFormData({ ...formData, category: e.target.value });
            }}
            value={formData.category}
          >
            <option value="uncategorized">Choose a category</option>
            <option value="javascript">javaScript</option>
            <option value="nexjs">NextJs</option>
            <option value="reactjs">ReactJs</option>
          </Select>
        </div>
        <div className="border-4 flex flex-col gap-6 sm:flex-row sm:gap-0 border-teal-500  border-dotted p-[0.65rem]  justify-between">
          <FileInput
            type="file"
            sizing={"sm"}
            accept="image/*"
            onChange={(e) => {
              setFile(e.target.files[0]);
            }}
          ></FileInput>
          <Button
            type="button"
            size={"sm"}
            outline
            gradientDuoTone={"purpleToBlue"}
            onClick={uploadImage}
          >
            {imageUploadProgress ? (
              <div className="w-10 h-10">
                <CircularProgressbar
                  value={imageUploadProgress}
                  text={`${imageUploadProgress || 0}%`}
                />
              </div>
            ) : (
              " Upload image"
            )}
          </Button>
        </div>
        {imageUploadError && <Alert color="failure">{imageUploadError}</Alert>}
        {formData.image && (
          <img src={formData.image} className=" w-full object-cover h-72" />
        )}
        <ReactQuill
          placeholder="Write your thoughts..."
          value={formData.content}
          theme="snow"
          className="h-72 mb-12"
          required
          onChange={(value) => {
            setFormData({ ...formData, content: value });
          }}
        />
        <Button type="submit" gradientDuoTone="purpleToPink">
          {imageUploadProgress == null ? "Update Post" : <Spinner />}
        </Button>
        {publishError && <Alert color={"failure"}>{publishError}</Alert>}
      </form>
    </div>
  );
}
