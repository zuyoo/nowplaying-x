export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { code, verifier } = req.body;

  const params = new URLSearchParams();
  params.append("client_id", "6844de5da19b4b6e8a4aac2f7517cb16");
  params.append("grant_type", "authorization_code");
  params.append("code", code);
  params.append("redirect_uri", "https://nowplaying-x.vercel.app");
  params.append("code_verifier", verifier);

  const spotifyRes = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params,
  });

  const data = await spotifyRes.json();

  res.status(200).json(data);
}
