// /api/spotify-current.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { token } = req.body;
  if (!token) return res.status(400).json({ error: "No token provided" });

  const songRes = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
    headers: { Authorization: "Bearer " + token }
  });

  if (songRes.status === 204) return res.status(200).json({ message: "Nothing playing" });
  if (songRes.status !== 200) return res.status(songRes.status).json(await songRes.json());

  const songData = await songRes.json();
  res.status(200).json({ song: songData });
}
