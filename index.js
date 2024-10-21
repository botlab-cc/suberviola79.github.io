document.addEventListener("DOMContentLoaded", function () {
    const callbackForm = document.getElementById("callbackForm");
    const modal = document.getElementById("myModal");
    const closeButton = document.querySelector(".close");
    const toggleButton = document.getElementById("toggleButton");

    // Detectar si estamos de vuelta con el code en la URL
    const urlParams = new URLSearchParams(window.location.search);
    const authCode = urlParams.get("code");

    if (authCode) {
        fetchToken(authCode);
    }

    // Abrir el modal
    toggleButton.onclick = function () {
        modal.style.display = "block";
    };

    // Cerrar el modal
    closeButton.onclick = function () {
        modal.style.display = "none";
    };

    // Cerrar el modal al hacer clic fuera del contenido
    window.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    };

    callbackForm.onsubmit = async function (e) {
        e.preventDefault();

        const name = document.getElementById("name").value;
        const phone = document.getElementById("phone").value;

        localStorage.setItem("name", name);
        localStorage.setItem("phone", phone);

        const clientId = "de850a88-2b15-45b1-995d-38b94860dfaf"; // Client ID
        const redirectUri = "https://suberviola79.github.io/"; // Callback URL
        const scope = "outbound"; // Scope
        const authUrl = `https://login.mypurecloud.ie/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}`;

        window.location.href = authUrl;
    };

    async function fetchToken(code) {
        const clientId = "de850a88-2b15-45b1-995d-38b94860dfaf"; // Client ID
        const clientSecret = "YOUR_CLIENT_SECRET"; // Client Secret
        const redirectUri = "https://suberviola79.github.io/"; // Callback URL

        const tokenUrl = "https://login.mypurecloud.ie/oauth/token";

        const bodyData = new URLSearchParams({
            grant_type: "authorization_code",
            code: code,
            redirect_uri: redirectUri,
            client_id: clientId,
            client_secret: clientSecret,
        });

        try {
            const response = await fetch(tokenUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: bodyData.toString(),
            });

            const data = await response.json();

            if (data.access_token) {
                const accessToken = data.access_token;
                const name = localStorage.getItem("name");
                const phone = localStorage.getItem("phone");

                if (name && phone) {
                    createContact(accessToken, name, phone);
                } else {
                    alert("Datos de contacto no encontrados.");
                }

                localStorage.removeItem("name");
                localStorage.removeItem("phone");
            } else {
                console.error("Error al obtener el access_token:", data);
            }
        } catch (error) {
            console.error("Error en la solicitud del token:", error);
        }
    }

    async function createContact(token, name, phone) {
        const contactListId = "74832173-7c59-4e01-8844-b4ab999fe103"; // contactListId
        const url = `https://api.mypurecloud.ie/api/v2/outbound/contactlists/${contactListId}/contacts`;

        const body = JSON.stringify([{
            data: {
                NOMBRE: name,
                APELLIDO1: "ApellidoEjemplo", // Valor harcodeado para APELLIDO1
                TELEFONO: phone,
                MAIL: "email@ejemplo.com" // Valor harcodeado para MAIL
            },
            callable: true
        }]);

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: body,
            });

            if (response.ok) {
                alert("¡Contacto creado con éxito!");
            } else {
                alert("Error al crear el contacto.");
                console.error("Error en la solicitud:", await response.text());
            }
        } catch (error) {
            console.error("Error en la solicitud de creación de contacto:", error);
        }
    }
});

