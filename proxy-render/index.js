import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json({ limit: "1mb" }));

const SUPABASE_URL = process.env.SUPABASE_URL;      // e.g. https://xxxx.supabase.co
const SUPABASE_KEY = process.env.SUPABASE_KEY;      // anon service key
const TABLE = process.env.TABLE || "colmena";       // default table

const PROXY_TOKEN = process.env.PROXY_TOKEN || null; // optional shared secret

app.get("/", (req, res) => {
  res.json({ ok: true, info: "POST JSON to /data to forward to Supabase" });
});

app.post("/data", async (req, res) => {
  try {
    if (!SUPABASE_URL || !SUPABASE_KEY) {
      return res.status(500).json({ error: "Missing SUPABASE_URL or SUPABASE_KEY env var" });
    }

    if (PROXY_TOKEN && req.get("X-Token") !== PROXY_TOKEN) {
      return res.status(401).json({ error: "Unauthorized: bad token" });
    }

    const target = `${SUPABASE_URL}/rest/v1/${TABLE}`;
    const upstream = await fetch(target, {
      method: "POST",
      headers: {
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
        "Prefer": "return=representation"
      },
      body: JSON.stringify(req.body || {})
    });

    const text = await upstream.text();
    const ct = upstream.headers.get("content-type") || "application/json";
    res.status(upstream.status).type(ct).send(text);
  } catch (err) {
    res.status(500).json({ error: err.message || String(err) });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Proxy listening on port ${PORT}`);
});
