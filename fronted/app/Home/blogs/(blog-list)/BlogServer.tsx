import BlogClient from "./BlogClient";

type BlogSectionProps = {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
};

async function fetchBlogs({ category = "All", search = "", page = 1, limit = 3, }: BlogSectionProps) {


  // ✅ Server component: call backend directly, NOT through /api proxy
  const endpoint = `${process.env.NEXT_PUBLIC_BACKEND_URL}/blog/allblog`



  const url = `${endpoint}?page=${page}&limit=${limit}&category=${category}&search=${search}`;

  const res = await fetch(url, {
    next: { revalidate: 60 },
  });

  console.log("The fetched wholeblog is:", res)

  if (!res.ok) {
    throw new Error("Failed to fetch blogs");
  }

  return res.json();
}

export default async function BlogSection() {
  const initialData = await fetchBlogs({
    category: "All",
    search: "",
    page: 1,
    limit: 3,
  });

  return <BlogClient initialData={initialData} />;

}