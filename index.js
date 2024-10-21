// Función para obtener parámetros de la URL
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Intercambio del 'code' por el 'access_token'
async function exchangeCodeForToken(code) {
    const clientId = 'de850a88-2b15-45b1-995d-38b94860dfaf'; // Tu Client ID
    const clientSecret = 'TU_CLIENT_SECRET'; // Tu Client Secret
    const redirectUri = 'https://suberviola79.github.io/'; // Callback URL

    const body = new URLSearchParams();
    body.append('grant_type', 'authorization_code');
    body.append('code', code);
    body.append('redirect_uri', redirectUri);
    body.append('client_id', clientId);
    body.append('client_secret', clientSecret);

    try {
        const response = await fetch('https://login.mypurecloud.ie/oauth/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: body.toString(),
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Access Token:', data.access_token);
            return data.access_token;
        } else {
            console.error('Error al obtener el token:', response.statusText);
            return null;
        }
    } catch (error) {
        console.error('Error en la solicitud:', error);
        return null;
    }
}

// Función para crear un contacto en Genesys Cloud
async function createContact(accessToken, name, phone) {
    const contactListId = '74832173-7c59-4e01-8844-b4ab999fe103'; // Tu ID de lista de contactos en Genesys
    const apiUrl = `https://api.mypurecloud.ie/api/v2/outbound/contactlists/${contactListId}/contacts`;

    const body = JSON.stringify([{
        data: {
            NOMBRE: name,
            TELEFONO: phone,
            MAIL: 'email@ejemplo.com' // Puedes agregar otros campos si lo deseas
        },
        callable: true
    }]);

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: body,
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Contacto creado:', data);
            alert('Contacto creado exitosamente');
        } else {
            console.error('Error al crear el contacto:', response.statusText);
            alert('Error al crear el contacto');
        }
    } catch (error) {
        console.error('Error en la solicitud:', error);
        alert('Error en la solicitud al crear el contacto');
    }
}

// Comprobar si existe el 'code' en la URL
const code = getQueryParam('code');

if (code) {
    // Si hay un 'code', intercambiarlo por el 'access_token'
    exchangeCodeForToken(code).then((accessToken) => {
        if (accessToken) {
            // Una vez que tenemos el token, crear el contacto
            const name = 'Juan Pérez'; // O usa los valores del formulario
            const phone = '+34123456789'; // Ejemplo de teléfono

            createContact(accessToken, name, phone);
        }
    });
} else {
    // Si no hay 'code', lanzar el flujo OAuth cuando se envíe el formulario
    document.getElementById('callbackForm').onsubmit = function (e) {
        e.preventDefault();

        // Obtener los datos del formulario
        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;

        // Redirigir al usuario a la página de autorización de Genesys
        const clientId = 'de850a88-2b15-45b1-995d-38b94860dfaf'; // Tu Client ID
        const redirectUri = 'https://suberviola79.github.io/'; // Callback URL
        const scope = 'outbound'; // Scope para crear contactos
        const authUrl = 'https://login.mypurecloud.ie/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}';

        // Redirigir al usuario a la URL de autorización
        window.location.href = authUrl;
    };
}
