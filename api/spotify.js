// /api/spotify.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { code, verifier } = req.body;

  if (!code || !verifier) return res.status(400).json({ error: "Missing code or verifier" });

  const params = new URLSearchParams();
  params.append("client_id", "6844de5da19b4b6e8a4aac2f7517cb16");
  params.append("client_secret", "65f57cb6431b436983ef8624e0310d41"); // safe in backend
  params.append("grant_type", "authorization_code");
  params.append("code", code);
  params.append("redirect_uri", "https://nowplaying-x.vercel.app");
  params.append("code_verifier", verifier);

  const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params
  });

  const tokenData = await tokenRes.json();
  if (!tokenData.access_token) return res.status(400).json(tokenData);

  res.status(200).json({ access_token: tokenData.access_token, refresh_token: tokenData.refresh_token, expires_in: tokenData.expires_in });
}
