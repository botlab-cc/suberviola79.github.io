// Configuración de la aplicación
const clientId = "de850a88-2b15-45b1-995d-38b94860dfaf"; // Client ID
const clientSecret = "Bmy5Tgwa0V44L1uulM_BgqznH1k4Mk6LLqQd31vQq7Q"; // Client Secret
const tokenUrl = "https://login.mypurecloud.ie/oauth/token"; // URL para obtener el token
const contactListId = "74832173-7c59-4e01-8844-b4ab999fe103"; // ID de la lista de contactos

// Función para obtener el token de acceso
async function getAccessToken() {
    try {
        const response = await fetch(tokenUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({
                grant_type: "client_credentials", // Tipo de autorización
                client_id: clientId,
                client_secret: clientSecret
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            alert(`Error al obtener el token: ${errorData.error_description}`);
            throw new Error("Error al obtener el token de acceso");
        }

        const data = await response.json();
        alert(`Token de acceso obtenido: ${data.access_token}`); // Muestra el token obtenido
        return data.access_token;
    } catch (error) {
        console.error(error);
        alert("Ocurrió un error al obtener el token de acceso.");
    }
}

// Función para crear un contacto
async function createContact(token, nombre, apellido1, telefono, mail) {
    const apiUrl = "https://api.mypurecloud.ie/api/v2/outbound/contactlists/${contactListId}/contacts";
    const contactData = [{
        data: {
            NOMBRE: nombre,
            APELLIDO1: apellido1,
            TELEFONO: telefono,
            MAIL: mail
        },
        callable: true
    }];

    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(contactData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            alert(`Error al crear el contacto: ${errorData.error_description}`);
            throw new Error("Error al crear el contacto");
        }

        const data = await response.json();
        alert("Contacto creado con éxito"); // Mensaje de éxito
    } catch (error) {
        console.error(error);
        alert("Ocurrió un error al crear el contacto.");
    }
}

// Manejo del envío del formulario
const callbackForm = document.getElementById("callbackForm");
callbackForm.onsubmit = async function (e) {
    e.preventDefault();

    // Obtener datos del formulario
    const nombre = document.getElementById("name").value;
    const telefono = document.getElementById("phone").value;
    const apellido1 = "Apellido1"; // Valor hardcodeado
    const mail = "ejemplo@dominio.com"; // Valor hardcodeado

    // Alert de depuración
    alert("Depuración v1.0.1");

    // Obtener el token de acceso y crear el contacto
    const token = await getAccessToken();
    if (token) {
        await createContact(token, nombre, apellido1, telefono, mail);
    }
};
