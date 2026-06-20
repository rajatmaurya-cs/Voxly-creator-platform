import { apiFetch } from "@/lib/apiFetch";
import { useInfiniteQuery } from "@tanstack/react-query";

export function useHomeBlogs({
  category = "All",
  limit = 3,
  initialData,
} = {}) {

  

  const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/blog/allblog`

  return useInfiniteQuery({
    queryKey: ["blogs", category, limit],

    queryFn: async ({ pageParam = 1 }) => {

      const url = `${endpoint}?page=${pageParam}&limit=${limit}&category=${encodeURIComponent(category)}`;

      const res = await apiFetch(url);

      if (!res.ok) {
        throw new Error("Failed to fetch blogs");
      }

      const data = await res.json();

      if (!data?.success) {
        throw new Error(data?.message || "API error");
      }

      return data;
    },

    initialData:
      category === "All" && initialData
        ? {
          pages: [initialData],
          pageParams: [1],
        }
        : undefined,

    getNextPageParam: (lastPage) =>
      lastPage?.hasMore ? lastPage.nextPage : undefined,

    staleTime: 30000,
    refetchOnWindowFocus: false,
    retry: 1,
  });
}