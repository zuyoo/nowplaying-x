export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { code, verifier } = req.body;

  // Step 1: exchange code for access token
  const params = new URLSearchParams();
  params.append("client_id", "YOUR_CLIENT_ID");
  params.append("client_secret", "YOUR_CLIENT_SECRET"); // safe in backend
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
  const accessToken = tokenData.access_token;

  if (!accessToken) return res.status(400).json(tokenData);

  // Step 2: fetch current playing song from backend
  const songRes = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
    headers: { Authorization: "Bearer " + accessToken }
  });

  if (songRes.status === 204) return res.status(200).json({ message: "Nothing playing" });
  if (songRes.status !== 200) return res.status(songRes.status).json(await songRes.json());

  const songData = await songRes.json();
  return res.status(200).json({ song: songData, access_token: accessToken });
}
