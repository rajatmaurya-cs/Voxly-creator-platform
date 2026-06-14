import BlogClient from "./BlogClient";

type BlogSectionProps = {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
};

async function fetchBlogs({ category = "All", search = "", page = 1, limit = 3, }: BlogSectionProps) {
  
  // const endpoint =
  //   "https://postifybackend-six.vercel.app/api/blog/allblog" ;

    const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/blog/allblog`

    console.log("⛳️ The Homepage blog fetched using : ", process.env.NEXT_PUBLIC_API_URL)

  const url = `${endpoint}?page=${page}&limit=${limit}&category=${category}&search=${search}`;

  const res = await fetch(url, {
    next: { revalidate: 60 },
  });

  console.log("The fetched wholeblog is:",res)

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