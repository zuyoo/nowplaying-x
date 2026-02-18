// /api/spotify-current.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { token } = req.body;
  if (!token) return res.status(400).json({ error: "No token provided" });

  try {
    const songRes = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
      headers: { Authorization: "Bearer " + token }
    });

    if (songRes.status === 204) {
      return res.status(200).json({ message: "Nothing playing" });
    }

    if (songRes.status === 401) {
      return res.status(200).json({ message: "Access token expired, please reset" });
    }

    if (!songRes.ok) {
      const errData = await songRes.json().catch(() => ({}));
      return res.status(songRes.status).json(errData);
    }

    const songData = await songRes.json();
    return res.status(200).json({ song: songData });
  } catch (err) {
    console.error("Spotify fetch error:", err);
    return res.status(500).json({ error: "Failed to fetch currently playing song" });
  }
}
