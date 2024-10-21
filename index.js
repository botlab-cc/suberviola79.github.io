const modal = document.getElementById("myModal");
const toggleButton = document.getElementById("toggleButton");

toggleButton.onclick = function () {
    modal.style.transform = modal.style.transform === "translateY(0%)" ? "translateY(100%)" : "translateY(0%)";
};

const callbackForm = document.getElementById("callbackForm");
callbackForm.onsubmit = async function (e) {
    e.preventDefault();

    // Obtener datos del formulario
    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;

    // Redirigir a la URL de autorización de Genesys Cloud
    const clientId = "de850a88-2b15-45b1-995d-38b94860dfaf"; // Reemplaza con tu Client ID
    const redirectUri = "https://suberviola79.github.io/"; // Reemplaza con tu Callback URL
    const scope = "outbound"; // Scope para crear contactos
    const authUrl = `https://login.mypurecloud.ie/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}`;

    // Abrir la URL de autorización en una nueva ventana
    window.open(authUrl, "_blank");
};
