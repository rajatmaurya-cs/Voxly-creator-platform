import React from "react";
import Blogclient from "./Blogclient";
import { apiFetch } from "@/lib/apiFetch";


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
  likes?: string[];
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

 const res = await apiFetch(
  `${process.env.NEXT_PUBLIC_API_URL}/blog/blogbyid/${Id}?blogId=${Id}`,
  {
    next: {
      revalidate: 300, 
    },
  }
);


const end:number = Date.now();



  const data: BlogResponse = await res.json();



  return (
    <div>
      <Blogclient blog={data.blog} />
    </div>
  );
};

export default Blogserver;