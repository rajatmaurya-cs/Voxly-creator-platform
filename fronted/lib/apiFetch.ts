
let refreshPromise: Promise<boolean> | null = null;

export async function apiFetch(
  endpoint: string,
  options: RequestInit = {}
) {
  const makeRequest = async () => {
    return fetch(endpoint, {
      ...options,
      credentials: "include",
    });
  };

  let response = await makeRequest();

  console.log("The response received in apiFetch is: ", response.status)

  // ✅ If not 401 → return normally
  if (response.status !== 401) {
    return response;
  }


  if (!refreshPromise) {

    refreshPromise = (async () => {

      try {

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refreshtoken`,
          {
            method: "POST",
            credentials: "include",
          }
        );

        const currentTime = new Date().toLocaleTimeString("en-IN", {
          timeZone: "Asia/Kolkata",
          hour12: false,
        });

        console.log(
          "Generated New AccessToken at ✅ :",
          currentTime
        );
        
        return res.ok;


      } catch (err) {

        return false;

      }

      finally {

        refreshPromise = null;

      }

    })();

  }

  const refreshed = await refreshPromise;

  // ❌ refresh failed → logout flow
  // ❌ refresh failed → logout flow
  if (!refreshed) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "User is not logged in",
      }),
      {
        status: 401,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  // 🔁 retry original request ONCE
  response = await makeRequest();

  return response;

}