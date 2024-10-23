import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CallToAction from "../components/CallToAction";
import PostCard from "../components/PostCard";
export default function Home() {
  const [posts, setPosts] = useState([]);
  const fetchPosts = async () => {
    const res = await fetch("/api/post/getPosts");
    if (res.ok) {
      const data = await res.json();
      setPosts(data.posts);
    }
  };
  useEffect(() => {
    fetchPosts();
  }, []);
  return (
    <div>
      <div className="flex flex-col gap-6 p-28 px-3  max-w-6xl mx-auto  ">
        <h1 className="text-3xl font-bold lg:text-6xl ">Welcome to my Blog</h1>
        <p className="text-gray-500 text-xs sm:text-sm">
          Here you'll find a variety of articles and tutorials on topics such as
          web development, software engeering and programming
        </p>
        <Link
          to="/search"
          className="text-xs sm:text-sm text-teal-500 font-bold hover:underline"
        >
          View all posts
        </Link>
      </div>
      <div className="p-3 bg-amber-100 dark:bg-slate-700 m-3 sm:m-6 rounded-xl ">
        <CallToAction />
      </div>
      <div className="max-w-6xl mx-auto flex flex-col gap-8 p-3 py-7">
        {posts && posts.length > 0 && (
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-semibold text-center">Recent Posts</h2>
            <div className="flex flex-wrap gap-4">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
            <Link
              className="text-lg text-teal-500 hover:underline text-center"
              to={"search"}
            >
              View all posts
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
