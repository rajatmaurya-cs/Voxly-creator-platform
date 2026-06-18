import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Helper to check if a JWT token is expired
function isTokenExpired(token: string | undefined) {
  if (!token) return true;
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return true;
    
    const base64Url = parts[1];
    let base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    // Add base64 padding if missing to prevent decoding failure in Edge/Vercel environments
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

// Safely extracts a specific cookie value from a combined Set-Cookie header string
function extractCookieValue(setCookieHeaderStr: string, name: string): string | null {
  const searchStr = name + "=";
  const startIdx = setCookieHeaderStr.indexOf(searchStr);
  if (startIdx === -1) return null;
  
  const valueStart = startIdx + searchStr.length;
  let endIdx = setCookieHeaderStr.indexOf(";", valueStart);
  if (endIdx === -1) {
    endIdx = setCookieHeaderStr.length;
  }
  
  // Clean up any trailing commas that might separate multiple cookies
  let value = setCookieHeaderStr.slice(valueStart, endIdx).trim();
  if (value.endsWith(",")) {
    value = value.slice(0, -1).trim();
  }
  return value;
}

export async function proxy(request: NextRequest) {
  // ---------------------------------------------------------------------------
  // CRITICAL FIX: Detect whether this is a full-page browser navigation 
  // (typing URL / hard refresh) vs a Next.js client-side RSC request 
  // (Link click / prefetch).
  //
  // WHY: Next.js App Router treats routes with <Suspense> as having a "static 
  // shell" (Partial Prerendering). For these routes, the client router sends 
  // RSC fetch requests WITHOUT cookies (sec-fetch-dest: "empty"). If middleware 
  // redirects these cookieless requests, the client router CACHES the redirect 
  // and breaks all subsequent navigations to that route.
  //
  // FIX: Only redirect to login for full-page document requests (browser 
  // address bar navigation). For RSC requests without cookies, pass through — 
  // the client-side AuthProvider handles auth for those routes.
  // ---------------------------------------------------------------------------
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
    // Only redirect full-page navigations (browser address bar / hard refresh).
    // RSC/prefetch requests without cookies MUST pass through to avoid poisoning
    // the Next.js client router cache with a cached redirect.
    if (!isDocumentRequest) {
      return NextResponse.next();
    }
    const response = NextResponse.redirect(new URL("/auth/login", request.url));
    response.cookies.delete("accessToken");
    response.cookies.delete("refreshToken");
    return response;
  }

 
  if (isAccessExpired && refreshToken) {
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
        
        console.log("\n\nNew Access Token 🎃 :", newAccessToken ? "Found" : "Not Found");

        console.log("\n\nNew Refresh Token 🎃 :", newRefreshToken ? "Found" : "Not Found");


        const requestHeaders = new Headers(request.headers);


        if (newAccessToken) {
          request.cookies.set("accessToken", newAccessToken);
        }
        if (newRefreshToken) {
          request.cookies.set("refreshToken", newRefreshToken);
        }

       
        const newCookieHeaderValue = request.cookies.getAll()
          .map((c) => `${c.name}=${c.value}`)
          .join("; ");
        
        requestHeaders.set("cookie", newCookieHeaderValue);

       
        const response = NextResponse.next({
          request: {
            headers: requestHeaders,
          },
        });

    
        if (newAccessToken) {
          response.cookies.set("accessToken", newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 1000  , // 15 minutes (in seconds)
          });
        }
        if (newRefreshToken) {
          response.cookies.set("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 7 * 24 * 60 * 60, // 7 days (in seconds)
          });
        }

        return response;
      } else {
  
        const response = NextResponse.redirect(new URL("/auth/login", request.url));
        response.cookies.delete("accessToken");
        response.cookies.delete("refreshToken");
        return response;
      }
    } catch (err) {
      console.error("Middleware token refresh error:", err);
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
    "/admin",
    "/admin/:path*",
    
  ],
};