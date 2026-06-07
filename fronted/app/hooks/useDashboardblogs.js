import { apiFetch } from "@/lib/apiFetch";
import { useQuery } from "@tanstack/react-query";


export function useDashboardblogs({ limit = 5, isAdmin = true, category = "All" }) {

  return useQuery({

    queryKey: ["latest-blogs", category, limit, isAdmin,],

    queryFn: async () => {


      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/blog/admin/blogs?page=1&limit=${limit}&category=${category}`,
        {
          credentials: "include",
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch latest blogs");
      }

      const json = await res.json();

      console.log("The react-querry of blogsdashboard:", json)

      if (!json.success) {
        throw new Error(
          json.message || "Failed to fetch latest blogs"
        );
      }

      return json.blogs || [];
    },

    staleTime: 30_000,

    refetchOnWindowFocus: false,

    retry: 1,
  });
}