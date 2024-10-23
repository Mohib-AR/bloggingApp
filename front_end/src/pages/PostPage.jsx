import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Spinner, Button } from "flowbite-react";
import PostCard from "../components/PostCard";
import CallToAction from "../components/CallToAction";
import CommentSection from "../components/CommentSection";
export default function PostPage() {
  const { postSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(true);
  const [post, setPost] = useState(true);
  const [recentPosts, setRecentPosts] = useState([]);
  console.log(recentPosts);
  const fetchPost = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/post/getPosts?slug=${postSlug}`);
      const data = await res.json();
      if (!res.ok) {
        setError(true);
        setLoading(false);
        return;
      }
      if (res.ok) {
        setPost(data.posts[0]);
        setLoading(false);
        setError(false);
      }
    } catch (error) {
      setError(true);
      setLoading(false);
    }
  };
  const fetchRecentPosts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/post/getPosts?limit=3`);

      if (res.ok) {
        const data = await res.json();
        setRecentPosts(data.posts);
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  useEffect(() => {
    fetchPost();
  }, [postSlug]);
  useEffect(() => {
    fetchRecentPosts();
  }, []);

  if (loading) {
    <div className="flex justify-center items-center min-h-screen">
      <Spinner size={"xl"} />
    </div>;
  }
  return (
    <main className="p-3  flex flex-col max-w-6xl mx-auto min-h-screen">
      <h1 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl">
        {post && post.title}
      </h1>
      <Link className="self-center mt-5">
        <Button color={"gray"} pill size={"xs"}>
          {" "}
          {post && post.category}
        </Button>
      </Link>
      <img
        src={post && post.image}
        alt={post && post.title}
        className="mt-4 max-h-[490px] mx-auto p-3 w-10/12 object-cover"
      />
      <div className="flex justify-between mx-12  border-b p-3  border-slate-400 text-sm">
        <span className="">
          {post && new Date(post.createdAt).toLocaleDateString()}
        </span>
        <span>
          {post && (post.content?.length / 1000).toFixed(0)} mins read
        </span>
      </div>
      <div
        className="p-3 sm:mt-10  max-w-2xl mx-auto w-full post-content"
        dangerouslySetInnerHTML={{ __html: post && post.content }}
      ></div>
      <div className="max-w-4xl mx-auto w-full sm:mt-8">
        <CallToAction />
      </div>

      <CommentSection postId={post._id} />

      <div className="flex flex-col justify-center items-center mb-5">
        <h1 className="text-xl mt-5">Recent articles</h1>
        <div className="flex flex-wrap gap-7 mt-5 justify-center ">
          {recentPosts &&
            recentPosts.map((post) => <PostCard key={post._id} post={post} />)}
        </div>
      </div>
    </main>
  );
}
