
import sqlite3 from "sqlite3";

sqlite3.verbose();

const DB_PATH = process.env.DB_PATH || "/data/app.db";

export function openDb() {

  return new sqlite3.Database(DB_PATH, (err) => {

    if (err) console.error("DB open error:", err.message);
    else console.log("SQLite DB:", DB_PATH);
  });
}

export function initDb(db) {

  db.run(

    `CREATE TABLE IF NOT EXISTS users (
      username TEXT PRIMARY KEY,
      password TEXT NOT NULL

    )`
    
  );
}