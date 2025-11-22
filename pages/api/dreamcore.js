"use strict";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ ok: false, error: "Method Not Allowed" });
  }
  try {
    const { color = "pastel blue", weather = "rainy", timeOfDay = "night" } = req.body || {};

    const prompt =
      `Dreamcore aesthetic looking out a window, outside scene is ${weather}, at ${timeOfDay}. ` +
      `Dominant color palette: ${color}. Soft haze, subtle glow, analog film grain, ethereal mood, ` +
      `realistic yet dreamy, cinematic composition, gentle contrast, muted saturation, detailed foreground window frame.`;

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY;

    if (OPENAI_API_KEY) {
      try {
        const r = await fetch("https://api.openai.com/v1/images/generations", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-image-1",
            prompt,
            size: "1024x1024",
            response_format: "b64_json",
          }),
        });
        if (!r.ok) {
          const errText = await r.text();
          return res.status(502).json({ ok: false, error: `Upstream error: ${errText}` });
        }
        const data = await r.json();
        const b64 = data?.data?.[0]?.b64_json || null;
        if (!b64) {
          return res.status(502).json({ ok: false, error: "No image returned" });
        }
        const imageDataUrl = `data:image/png;base64,${b64}`;
        return res.status(200).json({
          ok: true,
          provider: "openai",
          prompt,
          imageDataUrl,
        });
      } catch (err) {
        // fallthrough to placeholder below
      }
    }

    const seed = encodeURIComponent(`${color}-${weather}-${timeOfDay}-${Date.now()}`);
    const imageUrl = `https://picsum.photos/seed/${seed}/1024/1024`;
    return res.status(200).json({
      ok: true,
      provider: "placeholder",
      prompt,
      imageUrl,
    });
  } catch (err) {
    return res.status(500).json({ ok: false, error: String(err && err.message ? err.message : err) });
  }
}


