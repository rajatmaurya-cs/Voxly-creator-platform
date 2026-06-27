import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
function isTokenExpired(token: string | undefined) {
  if (!token) return true;
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return true;

    const base64Url = parts[1];
    let base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");

    const pad = base64.length % 4;
    if (pad) {
      base64 += "=".repeat(4 - pad);
    }
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    const payload = JSON.parse(jsonPayload);
    if (typeof payload.exp !== "number") return true;

    return Date.now() / 1000 >= payload.exp - 5;
  } catch (err) {
    return true;
  }
}


function extractCookieValue(setCookieHeaderStr: string, name: string): string | null {
  const searchStr = name + "=";
  const startIdx = setCookieHeaderStr.indexOf(searchStr);
  if (startIdx === -1) return null;

  const valueStart = startIdx + searchStr.length;
  let endIdx = setCookieHeaderStr.indexOf(";", valueStart);
  if (endIdx === -1) {
    endIdx = setCookieHeaderStr.length;
  }


  let value = setCookieHeaderStr.slice(valueStart, endIdx).trim();
  if (value.endsWith(",")) {
    value = value.slice(0, -1).trim();
  }
  return value;
}

export async function proxy(request: NextRequest) {


  const isDocumentRequest = request.headers.get("sec-fetch-dest") === "document";

  const accessToken = request.cookies.get("accessToken")?.value;

  const refreshToken = request.cookies.get("refreshToken")?.value;

  const isAccessExpired = isTokenExpired(accessToken);

  console.log("🔍 PROXY DEBUG:", {
    hasAccessToken: !!accessToken,
    hasRefreshToken: !!refreshToken,
    isAccessExpired,
    isDocumentRequest,
    secFetchDest: request.headers.get("sec-fetch-dest"),
    url: request.url,
  });

  if (isAccessExpired && !refreshToken) {

     const currentTime = new Date().toLocaleTimeString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour12: false,
    });


    console.log("In Porxyt.ts Both AccessToken & RefreshToken are not found at 🚫: ", currentTime)

    if (!isDocumentRequest) {
      return NextResponse.next();
    }
    const response = NextResponse.redirect(new URL("/auth/login", request.url));
    response.cookies.delete("accessToken");
    response.cookies.delete("refreshToken");
    return response;
  }


  const isLogoutRoute = request.nextUrl.pathname === "/api/auth/logout";

  if (isAccessExpired && refreshToken && !isLogoutRoute) {

    console.log("The AccessToken Expired & RefreshToken is present")

    const currentTime = new Date().toLocaleTimeString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour12: false,
    });


    console.log("The request goes for refreshAccessToken from fornted proxy.ts at: ", currentTime)


    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/refreshtoken`, {
        method: "POST",
        headers: {
          Cookie: `refreshToken=${refreshToken}`,
        },
      });

      if (res.ok) {

        const setCookieHeader = res.headers.get("set-cookie") || "";


        const newAccessToken = extractCookieValue(setCookieHeader, "accessToken");

        
        const newRefreshToken = extractCookieValue(setCookieHeader, "refreshToken");

        console.log("\n\nTokens refreshed in middleware:");

        console.log("\n\nNew Access Token proxy.ts 🎃 :", newAccessToken ? "Found" : "Not Found");

        console.log("\n\nNew Refresh Token  proxy.ts 🎃 :", newRefreshToken ? "Found" : "Not Found");


   
        const response = NextResponse.redirect(request.url, 307);

        if (newAccessToken) {
          response.cookies.set("accessToken", newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60,
          });
        }
        if (newRefreshToken) {
          response.cookies.set("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 7 * 24 * 60 * 60,
          });
        }

        const now = new Date().toLocaleTimeString("en-IN", {
          timeZone: "Asia/Kolkata",
          hour12: false,
        });

        console.log("Token Generated & Proceesing Further from proxy.ts at: ✅", now)

        return response;

      } else {
        if (!isDocumentRequest) {
          const response = NextResponse.next();
          response.cookies.delete("accessToken");
          response.cookies.delete("refreshToken");
          return response;
        }

        const response = NextResponse.redirect(new URL("/auth/login", request.url));
        response.cookies.delete("accessToken");
        response.cookies.delete("refreshToken");
        return response;
      }
    } catch (err) {
      console.error("Middleware token refresh error:", err);
      if (!isDocumentRequest) {
        return NextResponse.next();
      }
      const response = NextResponse.redirect(new URL("/auth/login", request.url));
      return response;
    }
  }


  return NextResponse.next();
}

export const config = {
  matcher: [

    "/superadmin",
    "/superadmin/:path*",
    "/dashboard",
    "/dashboard/:path*",
    "/api/ai/:path*",
    "/api/auth/me",
    "/api/auth/logout",
    "/api/blog/dashboard/:path*",
    "/api/blog/addblog",
    "/api/blog/toggle-blog",
    "/api/blog/delete-blog",
    "/api/blog/Report",
    "/api/comment/addcomment",
    "/api/comment/toggle-comment",
    "/api/comment/removecomment",
    "/api/payment/:path*",
    "/api/plan/updateplan/:path*",
    "/api/blog/like/:path*",
    "/api/auth/follow/:path*",
    
  ],
};