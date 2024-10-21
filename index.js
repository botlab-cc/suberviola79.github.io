document.addEventListener("DOMContentLoaded", function () {
    const toggleButton = document.getElementById("toggleButton");
    const modal = document.getElementById("myModal");
    const callbackForm = document.getElementById("callbackForm");

    // Abrir el modal
    toggleButton.onclick = function () {
        modal.style.display = "block";
    };

    // Cerrar el modal al hacer clic fuera del contenido
    window.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    };

    // Manejar el envío del formulario
    callbackForm.onsubmit = async function (e) {
        e.preventDefault(); // Evitar el envío del formulario

        const name = document.getElementById("name").value;
        const phone = document.getElementById("phone").value;
        const surname = "Apellido1"; // Hardcodeado
        const email = "correo@example.com"; // Hardcodeado

        // Obtener el código de autorización de la URL
        const code = getUrlParameter('code');
        if (!code) {
            alert("No se encontró el código de autorización.");
            return;
        }

        alert(`Código de autorización: ${code}`);
        console.log(`Código de autorización: ${code}`);

        // Obtener el token de acceso utilizando el código
        const token = await getAccessToken(code);
        if (!token) {
            alert("No se pudo obtener el token de acceso.");
            return;
        }

        alert(`Token de acceso: ${token}`);
        console.log(`Token de acceso: ${token}`);

        // Crear contacto en Genesys Cloud
        try {
            const response = await createContact(token, name, surname, phone, email);
            alert(`Respuesta de la creación del contacto: ${response.status}`);
            console.log(`Respuesta de la creación del contacto: ${response.status}`);

            if (response.ok) {
                alert("Contacto creado con éxito.");
            } else {
                alert("Error al crear el contacto.");
            }
        } catch (error) {
            console.error("Error en la solicitud:", error);
            alert("Se produjo un error al crear el contacto.");
        }

        modal.style.display = "none"; // Cerrar modal después de enviar
    };

    // Obtener el código de autorización de la URL
    function getUrlParameter(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }

    // Obtener el token de acceso
    async function getAccessToken(code) {
        const clientId = "de850a88-2b15-45b1-995d-38b94860dfaf"; // Reemplaza con tu Client ID
        const clientSecret = "enP1d2tQLXPaqZKXHpNZvGVX5eUjkZgsqF0slaJV84M"; // Reemplaza con tu Client Secret
        const redirectUri = "https://suberviola79.github.io/"; // Reemplaza con tu Callback URL

        const response = await fetch("https://login.mypurecloud.ie/oauth/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Basic " + btoa(`${clientId}:${clientSecret}`),
            },
            body: JSON.stringify({
                grant_type: "authorization_code",
                code: code,
                redirect_uri: redirectUri
            }),
        });

        if (!response.ok) {
            throw new Error("Error al obtener el token de acceso");
        }

        const data = await response.json();
        return data.access_token; // Retorna el token de acceso
    }

    // Crear un contacto en Genesys Cloud
    async function createContact(token, name, surname, phone, email) {
        const contactListId = "74832173-7c59-4e01-8844-b4ab999fe103"; // Reemplaza con tu Contact List ID
        const url = `https://api.mypurecloud.ie/api/v2/outbound/contactlists/${contactListId}/contacts`;

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify([{
                data: {
                    NOMBRE: name,
                    APELLIDO1: surname,
                    TELEFONO: phone,
                    MAIL: email
                },
                callable: true
            }]),
        });

        return response; // Retorna la respuesta de la API
    }
});
