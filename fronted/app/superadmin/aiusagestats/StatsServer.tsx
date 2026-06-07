// app/admin/ai-dashboard/page.tsx
import Client from "./StatsClient";
import { cookies } from "next/headers";
import { apiFetch } from "@/lib/apiFetch";

async function getAIStats() {

  const cookieStore = await cookies();

  const res = await apiFetch(`${process.env.NEXT_PUBLIC_API_URL}/ai/ai-dashboard`, {
  method: "GET",
  headers: {
    Cookie: cookieStore.toString(),
  },
});

  const data = await res.json();

  if (res.status === 401) {
    throw new Error(data.message || "Request failed");
  }

  console.log("The ai dashboard data is:", data);

  return data;


}

export default async function Page() {

  const data = await getAIStats();

  return (
    <div className="flex min-h-screen min-w-full justify-center items-center">
      <Client data={data} />
    </div>
  );
}