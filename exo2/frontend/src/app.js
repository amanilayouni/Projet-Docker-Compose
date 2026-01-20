

document.addEventListener("DOMContentLoaded", () => {

  const BACKEND = "http://localhost:5001";

  const backendUrlEl = document.getElementById("backendUrl");

  const usersDiv = document.getElementById("users");

  const createMsg = document.getElementById("createMsg");


  const newUsername = document.getElementById("newUsername");

  const newPassword = document.getElementById("newPassword");
  const btnCreate = document.getElementById("btnCreate");

  const btnRefresh = document.getElementById("btnRefresh");


  backendUrlEl.textContent = BACKEND;

  async function api(path, options = {}) {
    const res = await fetch(`${BACKEND}${path}`, {

      headers: { "Content-Type": "application/json" },
      ...options
    });

    const text = await res.text();
    let body = {};
    try {
      body = text ? JSON.parse(text) : {};
    } catch {
      body = { raw: text };
    }

    if (!res.ok) {
      throw new Error(body.error || `HTTP ${res.status}`);
    }
    return body;
  }

  async function refresh() {
    usersDiv.textContent = "Chargement...";

    try {
      const users = await api("/api/users");

      if (!users || users.length === 0) {
        usersDiv.innerHTML = "<p style='color:#666'>Aucun utilisateur.</p>";
        return;
      }

      usersDiv.innerHTML = "";
      
      for (const u of users) {

        const row = document.createElement("div");
        row.className = "user";
        row.innerHTML = `
          <div>
            <b>${u.username}</b>
            
          </div>
          <div class="row">
            <input placeholder="new password" type="password" data-user="${u.username}" />

            <button data-update="${u.username}">Update</button>

            <button data-delete="${u.username}">Delete</button>
          </div>
        `;
        usersDiv.appendChild(row);
      }
    } catch (err) {
      usersDiv.innerHTML = `<p style="color:red">Erreur: ${err.message}</p>`;
    }
  }

  btnRefresh.addEventListener("click", refresh);

  btnCreate.addEventListener("click", async () => {
    createMsg.textContent = "";
    const username = newUsername.value.trim();
    const password = newPassword.value;

    if (!username || !password) {

      
      createMsg.textContent = "Veuillez remplir username et password.";
      return;
    }

    try {
      await api("/api/users", {
        method: "POST",
        body: JSON.stringify({ username, password })
      });

      createMsg.textContent = "Utilisateur créé :)";
      newUsername.value = "";
      newPassword.value = "";
      await refresh();
    } catch (err) {
      createMsg.textContent = "Erreur: " + err.message;
    }
  });

  usersDiv.addEventListener("click", async (e) => {

    const updateUser = e.target.getAttribute("data-update");

    const deleteUser = e.target.getAttribute("data-delete");

    try {
      if (updateUser) {
        const input = usersDiv.querySelector(`input[data-user="${updateUser}"]`);
        const pwd = input.value;

        if (!pwd) {
          alert("Tape un nouveau mot de passe.");
          return;
        }

        await api(`/api/users/${encodeURIComponent(updateUser)}`, {
          method: "PUT",
          body: JSON.stringify({ password: pwd })
        });

        alert("Mot de passe mis à jour :)");
        input.value = "";
      }

      if (deleteUser) {
        await api(`/api/users/${encodeURIComponent(deleteUser)}`, {
          method: "DELETE"
        });
        alert("Utilisateur supprimé ;)");
        await refresh();
      }
    } catch (err) {
      
      alert("Erreur: " + err.message);
    }
  });

  refresh();
});
