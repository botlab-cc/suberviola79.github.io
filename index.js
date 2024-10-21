const apiUrl = "https://cors-anywhere.herokuapp.com/https://api.mygateway.com/v2/contacts"; // Proxy CORS

// Función para obtener el token de acceso
async function getAccessToken() {
    const tokenUrl = "https://api.mygateway.com/oauth/token"; // URL de tu API para obtener el token
    const clientId = "de850a88-2b15-45b1-995d-38b94860dfaf"; // Client ID
    const clientSecret = "Bmy5Tgwa0V44L1uulM_BgqznH1k4Mk6LLqQd31vQq7Q"; // Client Secret

    try {
        const response = await fetch(tokenUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({
                grant_type: "client_credentials",
                client_id: clientId,
                client_secret: clientSecret
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            alert(`Error al obtener el token: ${errorText}`);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        alert("Token de acceso obtenido: " + data.access_token); // Depuración del token
        return data.access_token;
    } catch (error) {
        console.error("Error en getAccessToken:", error);
        alert("Ocurrió un error al obtener el token.");
    }
}

// Función para crear un contacto
async function createContact(name, phone, surname, email) {
    try {
        alert("Depuración v1.0.1");

        const accessToken = await getAccessToken(); // Obtiene el token

        // Imprimir datos que se van a enviar para depuración
        const contactData = {
            name: name,
            phone: phone,
            surname: surname,
            email: email
        };

        alert("Datos del contacto a enviar: " + JSON.stringify(contactData));

        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(contactData) // Cuerpo del JSON
        });

        if (!response.ok) {
            const errorText = await response.text();
            alert(`Error al crear el contacto: ${errorText}`);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        alert("Contacto creado exitosamente: " + JSON.stringify(data));
    } catch (error) {
        console.error("Error en createContact:", error);
        alert("Ocurrió un error al crear el contacto.");
    }
}

// Lógica para abrir y cerrar el modal
document.getElementById("toggleButton").onclick = function() {
    document.getElementById("myModal").style.display = "block";
};

document.getElementsByClassName("close")[0].onclick = function() {
    document.getElementById("myModal").style.display = "none";
};

window.onclick = function(event) {
    if (event.target == document.getElementById("myModal")) {
        document.getElementById("myModal").style.display = "none";
    }
};

// Manejo del envío del formulario
document.getElementById("callbackForm").onsubmit = function(event) {
    event.preventDefault(); // Evita el envío del formulario
    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const surname = document.getElementById("surname").value;
    const email = document.getElementById("email").value;

    createContact(name, phone, surname, email); // Llama a la función para crear el contacto
};
