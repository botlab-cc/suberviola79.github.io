// Obtener el formulario de solicitud de llamada
const callbackForm = document.getElementById("callbackForm");

// Función para obtener el token de acceso usando Client Credentials
async function getAccessToken() {
    const response = await fetch("https://login.mypurecloud.ie/oauth/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
            grant_type: "client_credentials",
            client_id: "de850a88-2b15-45b1-995d-38b94860dfaf", // Tu Client ID
            client_secret: "enP1d2tQLXPaqZKXHpNZvGVX5eUjkZgsqF0slaJV84M" // Tu Client Secret
        }),
    });

    if (!response.ok) {
        throw new Error("Error al obtener el token de acceso");
    }

    const data = await response.json();
    return data.access_token;
}

// Función para crear un contacto
async function createContact(accessToken, name, surname, phone, email) {
    const response = await fetch("https://api.mypurecloud.ie/api/v2/outbound/contactlists/74832173-7c59-4e01-8844-b4ab999fe103/contacts", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json"
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

    if (!response.ok) {
        throw new Error("Error al crear el contacto");
    }

    const data = await response.json();
    return data;
}

// Manejar el envío del formulario
callbackForm.onsubmit = async function (e) {
    e.preventDefault();

    // Obtener los valores del formulario
    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const surname = "APELLIDO_HARDCODEADO"; // Apellido hardcodeado
    const email = "MAIL_HARDCODEADO"; // Email hardcodeado

    try {
        // Obtener el token de acceso
        const accessToken = await getAccessToken();
        alert(`Token de acceso obtenido: ${accessToken}`);
        
        // Crear el contacto
        const contact = await createContact(accessToken, name, surname, phone, email);
        alert("Contacto creado con éxito: " + JSON.stringify(contact));
    } catch (error) {
        console.error("Error:", error);
        alert("Error: " + error.message);
    }

    modal.style.display = "none"; // Cerrar el modal
};

