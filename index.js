document.addEventListener("DOMContentLoaded", function () {
    const callbackForm = document.getElementById("callbackForm");

    // Detectar si estamos de vuelta con el code en la URL
    const urlParams = new URLSearchParams(window.location.search);
    const authCode = urlParams.get("code");

    if (authCode) {
        // Si tenemos el authCode, realizar el intercambio por el access_token
        fetchToken(authCode);
    }

    callbackForm.onsubmit = async function (e) {
        e.preventDefault();

        // Obtener datos del formulario
        const name = document.getElementById("name").value;
        const phone = document.getElementById("phone").value;

        // Almacenar temporalmente los datos en el almacenamiento local
        localStorage.setItem("name", name);
        localStorage.setItem("phone", phone);

        // Redirigir a la URL de autorización de Genesys Cloud
        const clientId = "de850a88-2b15-45b1-995d-38b94860dfaf"; // Reemplaza con tu Client ID
        const redirectUri = "https://suberviola79.github.io/"; // Reemplaza con tu Callback URL
        const scope = "outbound"; // Scope para crear contactos
        const authUrl = `https://login.mypurecloud.ie/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}`;

        // Redirigir a la URL de autorización
        window.location.href = authUrl;
    };

    async function fetchToken(code) {
        const clientId = "de850a88-2b15-45b1-995d-38b94860dfaf"; // Reemplaza con tu Client ID
        const clientSecret = "enP1d2tQLXPaqZKXHpNZvGVX5eUjkZgsqF0slaJV84M"; // Reemplaza con tu Client Secret
        const redirectUri = "https://suberviola79.github.io/"; // Reemplaza con tu Callback URL

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
                // Guardar el access_token y continuar con la creación del contacto
                const accessToken = data.access_token;
                const name = localStorage.getItem("name");
                const phone = localStorage.getItem("phone");

                if (name && phone) {
                    createContact(accessToken, name, phone);
                } else {
                    alert("Datos de contacto no encontrados.");
                }

                // Limpiar los datos del almacenamiento local
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
        const contactListId = "74832173-7c59-4e01-8844-b4ab999fe103"; // Reemplaza con tu contactListId
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
