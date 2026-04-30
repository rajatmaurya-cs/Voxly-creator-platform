"use client";
import { blogCategories } from "@/app/assets/assets";
import { useState } from "react";
import { useHomeBlogs } from "../../hooks/useHomeBlogs";
import Link from "next/link";

type Blog = {
  _id: string;
  title: string;
  category: string;
  image: string;
  isPublished: boolean;
  createdBy: {
    _id: string;
    fullName: string;
    avatar: string;
  };
  moderatedBy: {
    _id: string;
    fullName: string;
  } | null;
  contentSource: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

type InitialData = {
  success: boolean;
  blogs: Blog[];
  hasMore: boolean;
  nextPage: number;
  page: number;
  limit: number;
  total: number;
};

type Page = {
  blogs: Blog[];
  hasMore: boolean;
  nextPage: number;
  page: number;
  limit: number;
  total: number;
};

type Props = {
  initialData: InitialData;
};

export default function BlogClient({ initialData }: Props) {

  console.log("The Backend url is from blogclient✅: ",process.env.NEXT_PUBLIC_API_URL)

  const [search, setSearch] = useState("");

  const [activeCategory, setActiveCategory] = useState("All");

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useHomeBlogs({
    category: activeCategory,
    limit: 3,
    initialData,
  });

  const blogs: Blog[] =
    data?.pages?.flatMap((page: Page) => page.blogs) ?? [];

  return (
    <section className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      
      <input
        type="text"
        placeholder="Search blogs..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-black"
      />

      
      <div className="flex flex-wrap gap-3">
        { blogCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              activeCategory === cat
                ? "bg-black text-white"
                : "border border-gray-300 bg-white hover:bg-gray-100"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Blog Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {blogs.map((blog) => (
          <Link href = {`/Home/blogs/${blog._id}`}
            key={blog._id}
            className="overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <img
              src={blog.image}
              alt={blog.title}
              className="h-52 w-full object-cover"
            />

            <div className="p-5 space-y-3">
              <span className="inline-block rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                {blog.category}
              </span>

              <h2 className="line-clamp-2 text-lg font-semibold text-gray-900">
                {blog.title}
              </h2>

              <div className="flex items-center gap-3 pt-2">
                <img
                  src={blog.createdBy.avatar}
                  alt={blog.createdBy.fullName}
                  className="h-10 w-10 rounded-full object-cover"
                />

                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {blog.createdBy.fullName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(blog.createdAt).toDateString()}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Load More */}
      {hasNextPage && (
        <div className="flex justify-center pt-4">
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="rounded-xl bg-black px-6 py-3 text-white transition hover:opacity-90 disabled:opacity-50"
          >
            {isFetchingNextPage ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </section>
  );
}