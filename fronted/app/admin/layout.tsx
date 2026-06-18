import { cookies } from "next/headers";
import AdminLayoutClient from "./AdminLayoutClient";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Read cookies to force Next.js to treat this route as Dynamic.
  // This prevents Vercel from stripping the Cookie header during prefetch requests.
  await cookies();
  
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
