// index.js

// Variables globales
const clientId = "de850a88-2b15-45b1-995d-38b94860dfaf"; // Reemplaza con tu Client ID
const clientSecret = "Bmy5Tgwa0V44L1uulM_BgqznH1k4Mk6LLqQd31vQq7Q"; // Reemplaza con tu Client Secret
const apiUrl = "https://api.mypurecloud.ie"; // URL base de Genesys Cloud
const scope = "outbound"; // Scope para crear contactos

// Función para obtener el token de acceso
async function getAccessToken() {
    const tokenUrl = `${apiUrl}/oauth/token`;
    const headers = {
        "Content-Type": "application/json",
        "Authorization": `Basic ${btoa(`${clientId}:${clientSecret}`)}` // Codificamos el Client ID y Client Secret
    };

    const body = JSON.stringify({
        grant_type: "client_credentials",
        scope: scope
    });

    try {
        const response = await fetch(tokenUrl, {
            method: "POST",
            headers: headers,
            body: body
        });
        
        if (!response.ok) {
            const error = await response.json();
            alert(`Error al obtener el token: ${error.error_description}`);
            throw new Error(error.error_description);
        }

        const data = await response.json();
        alert(`Token obtenido: ${data.access_token}`); // Alert para mostrar el token
        return data.access_token;

    } catch (error) {
        console.error("Error en getAccessToken:", error);
        alert(`Error en getAccessToken: ${error.message}`);
    }
}

// Función para crear un contacto en la lista de contactos
async function createContact(accessToken, name, lastName, phone, email) {
    const contactListId = "74832173-7c59-4e01-8844-b4ab999fe103"; // Reemplaza con tu Contact List ID
    const createContactUrl = `${apiUrl}/api/v2/outbound/contactlists/${contactListId}/contacts`;

    const headers = {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json"
    };

    const body = JSON.stringify([{
        data: {
            NOMBRE: name,
            APELLIDO1: lastName,
            TELEFONO: phone,
            MAIL: email
        },
        callable: true
    }]);

    try {
        const response = await fetch(createContactUrl, {
            method: "POST",
            headers: headers,
            body: body
        });

        if (!response.ok) {
            const error = await response.json();
            alert(`Error al crear el contacto: ${error.message}`);
            throw new Error(error.message);
        }

        alert("Contacto creado exitosamente.");
        
    } catch (error) {
        console.error("Error en createContact:", error);
        alert(`Error en createContact: ${error.message}`);
    }
}

// Función para abrir el modal
function openModal() {
    const modal = document.getElementById("myModal");
    modal.style.transform = "translateY(0%)"; // Muestra el modal
}

// Función para cerrar el modal
function closeModal() {
    const modal = document.getElementById("myModal");
    modal.style.transform = "translateY(100%)"; // Oculta el modal
}

// Evento al enviar el formulario
const callbackForm = document.getElementById("callbackForm");
callbackForm.onsubmit = async function (e) {
    e.preventDefault();

    // Obtener datos del formulario
    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const lastName = "ApellidoEjemplo"; // Valor hardcodeado
    const email = "ejemplo@correo.com"; // Valor hardcodeado

    alert("Depuración v1.0.1"); // Alert para la depuración

    // Obtener el token de acceso y crear el contacto
    const accessToken = await getAccessToken();
    if (accessToken) {
        await createContact(accessToken, name, lastName, phone, email);
    }

    closeModal(); // Cierra el modal después de enviar el formulario
};

// Evento para abrir el modal cuando se carga la página
document.addEventListener("DOMContentLoaded", function() {
    const toggleButton = document.getElementById("toggleButton");
    toggleButton.onclick = openModal; // Asignar evento al botón para abrir el modal
});
