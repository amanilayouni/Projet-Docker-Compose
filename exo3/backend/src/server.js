
import express from "express";

import cors from "cors";
import fetch from "node-fetch";
import { SocksProxyAgent } from "socks-proxy-agent";


const app = express();
app.use(cors());

const PORT = process.env.PORT || 5000;


const TOR_SOCKS = process.env.TOR_SOCKS || "socks5h://tor:9050";

const agent = new SocksProxyAgent(TOR_SOCKS);


// GET utilisateurs

app.get("/api/users", async (req, res) => {

  const results = Number(req.query.results || 8);

  try {
    const r = await fetch(`https://randomuser.me/api/?results=${results}`, { agent });
    
    if (!r.ok) return res.status(502).json({ error: "randomuser.me error" });

    const data = await r.json();
    const users = data.results.map(u => ({
      name: `${u.name.first} ${u.name.last}`,
      photo: u.picture.medium
    }));

    res.json(users);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});



app.listen(PORT, () => console.log(`Exo3 backend running on port ${PORT}`));
