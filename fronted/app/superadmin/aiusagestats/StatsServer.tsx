import Client from "./StatsClient";
import { cookies } from "next/headers";

async function getAIStats() {
  const cookieStore = await cookies();
  const allowedCookies = ["accessToken", "refreshToken"];

  // Construct cookie header from the fresh middleware cookies
  const cookieHeader = cookieStore
    .getAll()
    .filter((c) => allowedCookies.includes(c.name))
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  console.log("\n\nThe payload in cookieHeader is: ", cookieHeader);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/ai/ai-dashboard`,
    {
      method: "GET",
      headers: {
        Cookie: cookieHeader,
      },
      next: {
        revalidate: 300, // 5 minutes
      },
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Request failed");
  }

  console.log("The ai dashboard data is:", data);
  return data;
}

export default async function Page() {
  const data = await getAIStats();

  return (
    <div className="min-h-full w-full">
      <Client data={data} />
    </div>
  );
}
