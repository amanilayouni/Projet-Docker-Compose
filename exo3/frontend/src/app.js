

document.addEventListener("DOMContentLoaded", () => {

  const BACKEND = "http://localhost:5002";

  const statusEl = document.getElementById("status");
  const btn = document.getElementById("btn");
  const grid = document.getElementById("grid");

  async function loadUsers() {
    statusEl.textContent = "Chargement...";
    grid.innerHTML = "";

    try {
      const r = await fetch(`${BACKEND}/api/users?results=8`);
      if (!r.ok) throw new Error("Backend error");

      const users = await r.json();

      users.forEach(u => {
        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `<img src="${u.photo}" alt="photo"><div><b>${u.name}</b></div>`;
        grid.appendChild(card);
        
      });

      statusEl.textContent = `OK (${users.length} utilisateurs)`;
    } catch (e) {
      statusEl.textContent = "Erreur : " + e.message;
    }
  }

  btn.addEventListener("click", loadUsers);

  loadUsers();

});
