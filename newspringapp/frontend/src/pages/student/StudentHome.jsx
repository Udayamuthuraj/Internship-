import React from "react";
import { FaUserCircle, FaRegThumbsUp, FaRegComment } from "react-icons/fa";

const posts = [
  {
    id: 1,
    name: "Ramya Krishnan",
    year: "2015",
    department: "Computer Science",
    date: "May 29, 2025",
    content: "Excited to share that I’ve joined Google as a Software Engineer!",
  },
  {
    id: 2,
    name: "Arjun Raj",
    year: "2017",
    department: "IT",
    date: "May 28, 2025",
    content: "Don’t miss the Alumni Webinar on AI Trends next week! 🔥",
  },
];

const StudentHome = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fef9f8] to-[#fff] py-10 px-4">
      <h1 className="text-4xl font-bold text-[#930911] mb-6 text-center">
        Alumni Posts
      </h1>

      <div className="max-w-3xl mx-auto space-y-6">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 transition hover:shadow-xl"
          >
            <div className="flex items-center gap-4 mb-3">
              <FaUserCircle className="text-3xl text-[#930911]" />
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  {post.name}
                </h2>
                <p className="text-sm text-gray-500">
                  {post.department}, Batch of {post.year}
                </p>
              </div>
            </div>
            <p className="text-gray-700 text-base mb-4">{post.content}</p>
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>{post.date}</span>
              <div className="flex items-center gap-4">
                <FaRegThumbsUp className="hover:text-[#930911] cursor-pointer" />
                <FaRegComment className="hover:text-[#930911] cursor-pointer" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentHome;
