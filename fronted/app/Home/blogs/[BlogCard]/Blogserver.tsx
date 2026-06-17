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
  likes?: string[];
};

type BlogResponse = {
  success: boolean;
  blog: Blog;
  message?: string;
};

type BlogServerProps = {
  Id: string;
};

const Blogserver = async ({ Id }: BlogServerProps) => {

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  console.log("==== Blogserver (by-ID) Debug ====");
  console.log("Blog Id:", Id);
  console.log("NEXT_PUBLIC_BACKEND_URL:", backendUrl);

  // ✅ Guard: env variable not set
  if (!backendUrl) {
    console.error("❌ NEXT_PUBLIC_BACKEND_URL is not set!");
    return (
      <div className="min-h-screen bg-[#050816] flex flex-col items-center justify-center text-white gap-3">
        <p className="text-red-400 text-lg font-semibold">Configuration error</p>
        <p className="text-gray-400 text-sm">NEXT_PUBLIC_BACKEND_URL is not set. Check Vercel environment variables.</p>
      </div>
    );
  }

  const start: number = Date.now();

  let res: Response;

  try {
    // ✅ Server components must call the backend DIRECTLY (not via the /api proxy).
    // Using NEXT_PUBLIC_API_URL here would make an extra self-referential HTTP request on Vercel.
    res = await fetch(
      `${backendUrl}/blog/blogbyid/${Id}?blogId=${Id}`,
      {
        next: {
          revalidate: 300, // ISR: cache for 5 minutes
        },
      }
    );
  } catch (fetchError) {
    // ✅ Guard: fetch() itself throws — network error, DNS failure, invalid URL, timeout
    console.error("❌ fetch() threw an exception:", fetchError);
    return (
      <div className="min-h-screen bg-[#050816] flex flex-col items-center justify-center text-white gap-3">
        <p className="text-red-400 text-lg font-semibold">Failed to reach the server</p>
        <p className="text-gray-400 text-sm">Could not connect to the backend. Please try again.</p>
      </div>
    );
  }

  const end: number = Date.now();
  console.log("HTTP Status:", res.status);
  console.log("Time taken to fetch blog:", ((end - start) || 0) / 1000, "s");

  // ✅ Guard: non-2xx HTTP response (404, 500, etc.)
  if (!res.ok) {
    console.error(`❌ Blog fetch failed — HTTP ${res.status} for Id: ${Id}`);
    return (
      <div className="min-h-screen bg-[#050816] flex items-center justify-center text-white">
        <p className="text-gray-400 text-lg">Blog not found or failed to load. (HTTP {res.status})</p>
      </div>
    );
  }

  const data: BlogResponse = await res.json();

  console.log("data.success:", data.success);
  console.log("data.blog exists:", !!data.blog);

  // ✅ Guard: 2xx response but no blog field e.g. { success: false, message: "Not found" }
  if (!data.blog) {
    console.error(`❌ No blog in response. Backend message: ${data.message}`);
    return (
      <div className="min-h-screen bg-[#050816] flex items-center justify-center text-white">
        <p className="text-gray-400 text-lg">
          {data.message || "Blog not found."}
        </p>
      </div>
    );
  }

  return (
    <div>
      <Blogclient blog={data.blog} />
    </div>
  );
};

export default Blogserver;