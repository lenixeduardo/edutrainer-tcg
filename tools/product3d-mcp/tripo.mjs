const API = "https://openapi.tripo3d.ai/v3";
export function validateImageUrl(input) {
  const u = new URL(input);
  if (u.protocol !== "https:") throw new Error("Image URL must use HTTPS");
  if (/^(localhost|127\\.|10\\.|192\\.168\\.|169\\.254\\.|172\\.(1[6-9]|2[0-9]|3[01])\\.|::1)/i.test(u.hostname)) throw new Error("Private addresses are not allowed");
  return u.toString();
}
export async function tripo(path, options = {}) {
  const key = process.env.TRIPO_API_KEY;
  if (!key) throw new Error("TRIPO_API_KEY is not configured");
  const response = await fetch(API + path, {
    ...options,
    headers: {Authorization: "Bearer " + key, "Content-Type": "application/json", ...options.headers}
  });
  const result = await response.json();
  if (!response.ok || result.code !== 0) throw new Error(result.message || "Tripo API request failed");
  return result.data;
}
export function renderManifest({productId, modelUrl, background = "#ed65a3"}) {
  if (!/^[a-z0-9-]{1,80}$/.test(productId)) throw new Error("Invalid product ID");
  validateImageUrl(modelUrl);
  return {
    productId, modelUrl, format: "glb", published: false,
    viewer: {orbit: true, zoom: true, autoRotate: false},
    shots: [0,90,180,270].map((angle) => ({
      angle, aspectRatio: "3:4", width: 1200, height: 1600,
      background, output: productId + "-" + angle + ".png"
    }))
  };
}
