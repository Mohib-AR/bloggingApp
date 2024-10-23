import React from "react";

export default function About() {
  return (
    <>
      <div className="min-h-screen flex justify-center items-center">
        <div className="max-w-2xl mx-auto p-3 text-center">
          <div>
            <h1 className="text-3xl font-semibold text-center my-7">
              About Mohib's Blog
            </h1>
            <div className="text-md text-gray-500 flex flex-col gap-6">
              <p>
                Hello, I'm Mohib, a passionate software developer and problem
                solver with a deep love for coding. I enjoy exploring new
                technologies and sharing my knowledge through writing about
                them. This blog is my space to express thoughts on code, tech
                trends, and innovations.
              </p>
              <p>
                Here, you'll find weekly posts about the latest in web
                development, including topics like React, Next.js, and other
                emerging technologies. Be sure to check back often for fresh
                content that will keep you up to speed with the fast-paced tech
                world.
              </p>
              <p>
                Feel free to engage by commenting on posts, reading articles,
                and even sharing your thoughts. I believe in the power of
                community, where developers can help each other grow through
                shared knowledge and collaboration
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
