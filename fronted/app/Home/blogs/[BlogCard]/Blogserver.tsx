import React from "react";
import Blogclient from "./Blogclient";

type Blog = {
  _id: string;
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
  createdBy: {
    _id: string;
    fullName: string;
    email: string;
    avatar: string;
  };
};

type BlogResponse = {
  success: boolean;
  blog: Blog;
};

type BlogServerProps = {
  Id: string;
};

const Blogserver = async ({ Id }: BlogServerProps) => {

  const start:number = Date.now();

  const res = await fetch(
  `https://postifybackend-six.vercel.app/api/blog/blogbyid/${Id}?blogId=${Id}`,
  {
    cache: "force-cache",
  }
);

const end:number = Date.now();

console.log("The Time taken to fetch blogs:",((end-start) || 0)/1000)

  const data: BlogResponse = await res.json();



  return (
    <div>
      <Blogclient blog={data.blog} />
    </div>
  );
};

export default Blogserver;