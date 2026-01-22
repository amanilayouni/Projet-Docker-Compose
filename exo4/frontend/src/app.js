const elUsers = document.getElementById("users");
const elEmpty = document.getElementById("empty");
const elStatus = document.getElementById("status");

const elUsername = document.getElementById("username");
const elPassword = document.getElementById("password");

function setStatus(msg) {
  elStatus.textContent = msg || "";
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    "&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"
  }[c]));
}

async function refresh() {
  setStatus("Chargement...");
  try {
    const res = await fetch("/api/users");
    const data = await res.json();

    elUsers.innerHTML = "";
    if (!Array.isArray(data) || data.length === 0) {
      elEmpty.style.display = "block";
      setStatus("OK — 0 user");
      return;
    }
    elEmpty.style.display = "none";

 
    data.forEach(u => {
      const username = escapeHtml(u.username ?? "");
      const card = document.createElement("div");
      card.className = "user";
      card.innerHTML = `
        <div>
          <b>${username}</b><div class="hint">Compte utilisateur</div>
        </div>
        
      `;
      elUsers.appendChild(card);
    });

    setStatus(`OK — ${data.length} user(s)`);
  } catch (e) {
    setStatus("Erreur : " + e);
  }
}

async function createUser() {
  const username = elUsername.value.trim();
  const password = elPassword.value;

  if (!username || !password) return setStatus("Username + password obligatoires.");

  setStatus("Création...");
  const res = await fetch("/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });

  if (!res.ok) {
    const txt = await res.text();
    return setStatus(`Erreur (${res.status}) : ${txt}`);
  }

  elPassword.value = "";
  setStatus("User créé ✅");
  refresh();
}

async function updateUser() {
  const username = elUsername.value.trim();
  const password = elPassword.value;

  if (!username || !password) return setStatus("Username + nouveau password obligatoires.");

  setStatus("Modification...");
  const res = await fetch(`/api/users/${encodeURIComponent(username)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password })
  });

  if (!res.ok) {
    const txt = await res.text();
    return setStatus(`Erreur (${res.status}) : ${txt}`);
  }

  elPassword.value = "";
  setStatus("Password modifié ✅");
  refresh();
}

async function deleteUser() {
  const username = elUsername.value.trim();
  if (!username) return setStatus("Username obligatoire.");

  setStatus("Suppression...");
  const res = await fetch(`/api/users/${encodeURIComponent(username)}`, { method: "DELETE" });

  if (!res.ok) {
    const txt = await res.text();
    return setStatus(`Erreur (${res.status}) : ${txt}`);
  }

  setStatus("User supprimé ✅");
  refresh();
}

document.getElementById("refresh").onclick = refresh;
document.getElementById("create").onclick = createUser;
document.getElementById("update").onclick = updateUser;
document.getElementById("delete").onclick = deleteUser;

refresh();
