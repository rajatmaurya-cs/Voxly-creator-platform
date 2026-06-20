export async function apiFetch(
  endpoint: string,
  options: RequestInit = {}
) {
  const response = await fetch(endpoint, {
    ...options,
    credentials: "include",
  });


  if (response.redirected && response.url.includes("/auth/login")) {
    if (typeof window !== "undefined") {
      window.location.href = "/auth/login";
    }
  }

  return response;
}