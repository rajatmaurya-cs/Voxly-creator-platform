import type { Metadata } from "next";
import { Geist, Geist_Mono, Orbitron } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import { AuthProvider } from "./ContextProvider/AuthProvider";
// import { Toaster } from "react-hot-toast";
import { Toaster } from "sonner";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Veyra — The Home For Modern Creators",
  description: "Write powerful stories, grow your followers, and turn your ideas into content that people discover",
  verification: {
    google: "fZwwMWhwGsUvvcpgczOgKTvWYYzDRZoynIAZ-TTJi8E",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${orbitron.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#050816]">

        <Providers>
          <AuthProvider>
            {children}
          </AuthProvider>
        </Providers>

        <Toaster
        position="top-center"
          toastOptions={{
            classNames: {
              toast:
                "!bg-zinc-900/90 !text-white !border-zinc-700 backdrop-blur-lg",
              title: "!text-white",
              description: "!text-zinc-300",
              actionButton:
                "!bg-white !text-black !border-none",
            },
          }}
        />

      </body>
    </html>
  );
}