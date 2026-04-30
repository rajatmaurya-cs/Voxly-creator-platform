// "use client";

// import React from "react";

// type Blog = {
//   title: string;
//   subTitle: string;
//   content: string;
//   category: string;
//   image: string;
//   isPublished: boolean;
//   contentSource: string;

//   aiAnalysis: {
//     words: number;
//     sentences: number;
//     paragraphs: number;
//     avgSentenceLength: string;
//     totalScore: number;
//     verdict: string;
//   };

//   createdAt: string;
//   updatedAt: string;
// };

// type BlogClientProps = {
//   blog: Blog;
// };

// const Blogclient = ({ blog }: BlogClientProps) => {


//   return (
//     <div className="max-w-5xl mx-auto px-4 py-10">
     
//       <span className="inline-block bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full mb-4">
//         {blog.category}
//       </span>

//       {/* Title */}
//       <h1 className="text-4xl font-bold leading-tight mb-3">
//         {blog.title}
//       </h1>

//       {/* Subtitle */}
//       <p className="text-gray-600 text-lg mb-6">
//         {blog.subTitle}
//       </p>

//       {/* Image */}
//       <img
//         src={blog.image}
//         alt={blog.title}
//         className="w-full h-[450px] object-cover rounded-2xl mb-8"
//       />

      

//       {/* Content */}
//       <div
//         className="prose prose-lg max-w-none"
//         dangerouslySetInnerHTML={{ __html: blog.content }}
//       />

      
//     </div>
//   );
// };

// export default Blogclient;

"use client";

import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type Blog = {
  _id?: string;
  title: string;
  subTitle: string;
  content: string;
  category: string;
  image: string;
  isPublished: boolean;
  contentSource: string;

  aiAnalysis: {
    words: number;
    sentences: number;
    paragraphs: number;
    avgSentenceLength: string;
    totalScore: number;
    verdict: string;
  };

  createdAt: string;
  updatedAt: string;
};

type BlogClientProps = {
  blog: Blog;
};

const Blogclient = ({ blog }: BlogClientProps) => {
  const [comment, setComment] = useState("");
  const queryClient = useQueryClient();

  const blogId = blog._id;

  const addCommentMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comment/addcomment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: comment,
          blogId,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data?.success) {
        throw new Error(data?.message || "Comment failed");
      }

      return data;
    },

    onSuccess: (data) => {
      toast.success(data.message || "Comment added");
      setComment("");

      queryClient.invalidateQueries({
        queryKey: ["comments", blogId],
      });
    },

    onError: (err: any) => {
      const message = err?.message || "Failed to Add The comment";
      toast.error(message, { id: "toggle" });
    },
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Category */}
      <span className="inline-block bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full mb-4">
        {blog.category}
      </span>

      {/* Title */}
      <h1 className="text-4xl font-bold leading-tight mb-3">
        {blog.title}
      </h1>

      {/* Subtitle */}
      <p className="text-gray-600 text-lg mb-6">
        {blog.subTitle}
      </p>

      {/* Image */}
      <img
        src={blog.image}
        alt={blog.title}
        className="w-full h-[450px] object-cover rounded-2xl mb-8"
      />

      {/* Content */}
      <div
        className="prose prose-lg max-w-none mb-10"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />

      {/* Comment Box */}
      <div className="mt-10 border-t pt-6">
        <h2 className="text-2xl font-semibold mb-4">Add Comment</h2>

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your comment..."
          className="w-full border rounded-lg p-3 min-h-[120px] outline-none"
        />

        <button
          onClick={() => addCommentMutation.mutate()}
          disabled={addCommentMutation.isPending}
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {addCommentMutation.isPending ? "Posting..." : "Post Comment"}
        </button>
      </div>
    </div>
  );
};

export default Blogclient;