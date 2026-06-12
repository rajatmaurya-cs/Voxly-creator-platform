"use client";

import { blogCategories } from "@/app/assets/assets";
import { useState, useMemo } from "react";
import { useHomeBlogs } from "../../hooks/useHomeBlogs";
import Link from "next/link";
import { Search, CalendarDays } from "lucide-react";
import Image from "next/image";
import { BlogGridSkeleton } from "./loading-skeleton";

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
import { ChevronDown } from "lucide-react";

type Props = {
  initialData: InitialData;
};

export default function BlogClient({ initialData }: Props) {

  const [search, setSearch] = useState("");

  const [activeCategory, setActiveCategory] = useState("All");

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useHomeBlogs({
    category: activeCategory,
    limit: 3,
    initialData,
  });

  const blogs: Blog[] =
    data?.pages?.flatMap((page: Page) => page.blogs) ?? [];



  const { filteredBlogs, publishedBlogs } = useMemo(() => {
    const searchWords = search.toLowerCase().trim().split(/\s+/).filter(Boolean);

    const filtered = (blogs || []).filter((blog) => {

      if (searchWords.length === 0) return true; // show all when search empty

      const title = blog.title.toLowerCase();
      // Any word in search must exist in title
      return searchWords.some(word => title.includes(word));
    });

    const published = filtered.filter((blog) => blog.isPublished === true);
    return { filteredBlogs: filtered, publishedBlogs: published };
  }, [blogs, search, activeCategory]);



  return (
    <section className="min-h-screen bg-[#050816] text-white font-sans antialiased">
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 lg:px-8">

        {/* HEADER */}
        <div className="mb-10 flex flex-col gap-6">
          <div className="space-y-3">
            <h1 className="text-4xl font-medium tracking-tight md:text-5xl">
              Explore Blogs
            </h1>

            <p className="max-w-2xl text-sm font-normal text-gray-400 md:text-base">
              Discover premium articles, AI-generated insights, development
              tutorials, and modern tech content curated for developers.
            </p>
          </div>

          {/* SEARCH - centered + not too wide */}
          <div className="relative mx-auto w-full max-w-lg">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
            />

            <input
              type="text"
              placeholder="Search premium blogs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 pl-12 pr-4 text-sm font-normal text-white outline-none backdrop-blur-xl transition-all placeholder:text-gray-500 focus:border-white/20 focus:bg-white/[0.07] focus:ring-2 focus:ring-white/10"
            />
          </div>
        </div>

        {/* CATEGORY FILTER - centered */}
        <div className="mb-10 flex flex-wrap justify-center gap-3">
          {blogCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full border px-5 py-2.5 text-sm font-normal transition-all duration-300 ${activeCategory === cat
                ? "border-white/20 bg-white text-black shadow-lg shadow-white/10"
                : "border-white/10 bg-white/[0.03] text-gray-300 hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* BLOG GRID */}
        {isLoading ? (
          <BlogGridSkeleton />
        ) : (
          <div className="grid gap-7 sm:grid-cols-2 xl:grid-cols-3">
            {filteredBlogs.map((blog) => (
              <Link
                href={`/Home/blogs/${blog._id}`}
                key={blog._id}
                className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:border-white/20 hover:bg-white/[0.05] hover:shadow-2xl hover:shadow-black/40"
              >
                {/* IMAGE */}
                <div className="relative overflow-hidden">
                  <div className="relative h-60 w-full overflow-hidden">
                    <Image
                      src={blog?.image}
                      alt={blog?.title}
                      priority
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                  <span className="absolute left-4 top-4 rounded-full border border-white/10 bg-black/40 px-3 py-1 text-xs font-normal text-white backdrop-blur-md">
                    {blog.category}
                  </span>
                </div>

                {/* CONTENT */}
                <div className="space-y-5 p-5">
                  <h2 className="line-clamp-2 text-xl font-medium leading-relaxed text-white transition-colors group-hover:text-gray-200">
                    {blog.title}
                  </h2>

                  {/* AUTHOR */}
                  <div className="flex items-center justify-between gap-3 border-t border-white/10 pt-4">

                    <div className="flex items-center gap-3">

                      <div className="rounded-full border-2 border-white p-1 shadow-lg">
                        <Image
                          src={blog?.createdBy?.avatar || "/man.png"}
                          alt={blog?.createdBy?.fullName || "Unknown"}
                          width={44}
                          height={44}
                          priority
                          className="rounded-full object-cover"
                        />
                      </div>

                      <div>
                        <p className="text-sm font-normal text-gray-200">
                          {blog?.createdBy?.fullName || "Unknown"}
                        </p>

                        <div className="mt-1 flex items-center gap-1 text-xs font-normal text-gray-500">
                          <CalendarDays size={13} />
                          <span>
                            {new Date(blog.createdAt).toDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-normal text-gray-400">
                      Read
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* LOAD MORE */}
        {hasNextPage && (

          <div className="flex justify-center pt-14">
            {/* <button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="rounded-2xl border border-white/10 bg-white px-8 py-3 text-sm font-medium text-black transition-all duration-300 hover:scale-[1.02] hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isFetchingNextPage ? "Loading..." : "Load More"}
            </button> */}

             <button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          className="
            h-10
            inline-flex
            items-center
            justify-center
            gap-2
            rounded-xl
            border
            border-[#222733]
            bg-[#171b22]
            px-5
            text-xs
            font-medium
            tracking-tight
            text-[#c2c8d3]
            transition-all
            duration-200
            hover:border-[#364152]
            hover:bg-[#1d2430]
            disabled:opacity-40
          "
        >
          {isFetchingNextPage ? (
            <div className="flex items-center gap-2">
              
              <span>Loading updates...</span>
            </div>
          ) : (
            <>

              <span>See More</span>

              <ChevronDown className="h-4 w-4" />

            </>
          )}
        </button>
        
          </div>

        )}
      </div>
    </section>
  );
}