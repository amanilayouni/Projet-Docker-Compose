from flask import Flask, request, jsonify
import os, time
import psycopg2
import psycopg2.extras

app = Flask(__name__)

def conn():
    return psycopg2.connect(
        dbname=os.environ["DB_NAME"],
        user=os.environ["DB_USER"],
        password=os.environ["DB_PASSWORD"],
        host=os.environ["DB_HOST"],
        port=os.environ.get("DB_PORT", "5432"),
    )

def init_db():
    with conn() as c, c.cursor() as cur:
        cur.execute("""
          CREATE TABLE IF NOT EXISTS users (
            username TEXT PRIMARY KEY,
            password TEXT NOT NULL
          )
        """)


for _ in range(30):
    try:
        init_db()
        break
    except Exception:
        time.sleep(1)

@app.post("/api/users")
def create_user():
    body = request.get_json(force=True)
    with conn() as c, c.cursor() as cur:
        cur.execute("INSERT INTO users(username,password) VALUES (%s,%s)",
                    (body.get("username"), body.get("password")))
    return jsonify(status="created"), 201

@app.get("/api/users")
def list_users():
    with conn() as c, c.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
        cur.execute("SELECT username, password FROM users")
        rows = cur.fetchall()
    return jsonify(rows)

@app.put("/api/users/<username>")
def update_user(username):
    body = request.get_json(force=True)
    with conn() as c, c.cursor() as cur:
        cur.execute("UPDATE users SET password=%s WHERE username=%s",
                    (body.get("password"), username))
        if cur.rowcount == 0:
            return jsonify(error="not found"), 404
    return jsonify(status="updated")

@app.delete("/api/users/<username>")
def delete_user(username):
    with conn() as c, c.cursor() as cur:
        cur.execute("DELETE FROM users WHERE username=%s", (username,))
        if cur.rowcount == 0:
            return jsonify(error="not found"), 404
    return jsonify(status="deleted")

if __name__ == "__main__":
    port = int(os.environ.get("BACKEND_PORT", "5000"))
    app.run(host="0.0.0.0", port=port)
