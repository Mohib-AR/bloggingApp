import React from "react";
import { Link } from "react-router-dom";
export default function PostCard({ post }) {
  return (
    <div className="group relative  w-full border border-teal-500 hover:border-2 transition-all  h-[390px] overflow-hidden rounded-lg sm:w-[430px] xl:w-[356px]">
      <Link to={`/post/${post.slug}`}>
        <img
          src={post.image}
          alt="postimage.."
          className="h-[245px] w-full object-cover group-hover:h-[200px] transition-all duration-300 z-20"
        />
      </Link>
      <div className="flex flex-col gap-2 p-3">
        <p className="text-lg font-semibold line-clamp-2">{post.title}</p>
        <span className="italic text-sm">{post.category}</span>
        <Link
          to={`/post/${post.slug}`}
          className="z-10 group-hover:bottom-0 absolute bottom-[-200px] left-0 right-0 border border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white transition-all duration-300 rounded-md !rounded-tl-none m-2 py-2 text-center"
        >
          Read article
        </Link>
      </div>
    </div>
  );
}
