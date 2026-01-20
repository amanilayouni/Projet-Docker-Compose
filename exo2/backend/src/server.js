

import express from "express";

import cors from "cors";
import { openDb, initDb } from "./db.js";


const app = express();

app.use(cors());
app.use(express.json());

const db = openDb();
initDb(db);

app.get("/api/health", (req, res) => res.json({ ok: true }));

// CREATE

app.post("/api/users", (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: "username and password required" });

  db.run("INSERT INTO users(username, password) VALUES(?, ?)", [username, password], function (err) {
    if (err) {
      if (err.message.includes("UNIQUE")) return res.status(409).json({ error: "user already exists" });
      return res.status(500).json({ error: err.message });
    }
    return res.status(201).json({ username });
  });
});



// READ all

app.get("/api/users", (req, res) => {
  db.all("SELECT username FROM users ORDER BY username ASC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});


// READ one

app.get("/api/users/:username", (req, res) => {
  const { username } = req.params;
  db.get("SELECT username, password FROM users WHERE username = ?", [username], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: "not found" });
    res.json(row);
  });
});


// UPDATE

app.put("/api/users/:username", (req, res) => {
  const { username } = req.params;
  const { password } = req.body || {};
  if (!password) return res.status(400).json({ error: "password required" });

  db.run("UPDATE users SET password = ? WHERE username = ?", [password, username], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: "not found" });
    res.json({ username });
  });
});

// DELETE

app.delete("/api/users/:username", (req, res) => {
  const { username } = req.params;
  db.run("DELETE FROM users WHERE username = ?", [username], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: "not found" });
    res.json({ deleted: username });
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Backend Exo2 running on port ${PORT}"));