const setCookieHeaderStr = "refreshToken=eyJhbGci; Path=/; Expires=Sat, 27 Jun 2026 14:00:00 GMT; HttpOnly, accessToken=eyJ4NTY; Path=/; Expires=Sat, 20 Jun 2026 14:01:00 GMT; HttpOnly";

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

console.log("refreshToken:", extractCookieValue(setCookieHeaderStr, "refreshToken"));
console.log("accessToken:", extractCookieValue(setCookieHeaderStr, "accessToken"));
