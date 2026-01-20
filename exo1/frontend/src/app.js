

document.addEventListener("DOMContentLoaded", () => {

  const messageElement = document.getElementById("msg");

  fetch("http://localhost:5000/api/hello")

    .then((response) => {
      
      if (!response.ok) {

        throw new Error("Erreur HTTP " + response.status);
      }
      return response.json();
    })
    .then((data) => {
      messageElement.textContent = data.message;
    })
    .catch((error) => {

      console.error("Erreur lors de l'appel au backend :", error);

      messageElement.textContent = "Erreur : backend inaccessible";


    });





});

