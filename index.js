const express = require('express');
const axios = require('axios');
const querystring = require('querystring');

const app = express();
const port = 3000;

// Middleware para parsear JSON
app.use(express.json());

// Ruta para manejar el callback de OAuth y obtener el token
app.get('/callback', async (req, res) => {
    const code = req.query.code;

    try {
        const tokenResponse = await axios.post('https://login.mypurecloud.ie/oauth/token', querystring.stringify({
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: 'https://suberviola79.github.io/', // Debe coincidir con la URI de redirección registrada
            client_id: 'de850a88-2b15-45b1-995d-38b94860dfaf', // Reemplaza con tu Client ID
            client_secret: 'enP1d2tQLXPaqZKXHpNZvGVX5eUjkZgsqF0slaJV84M' // Reemplaza con tu Client Secret
        }));

        const accessToken = tokenResponse.data.access_token;

        // Aquí puedes usar el token para crear un contacto
        const contactListId = '74832173-7c59-4e01-8844-b4ab999fe103'; // Reemplaza con tu ID de lista de contactos
        const { nombre, apellido, telefono, email } = req.body; // Obtener datos del contacto del cuerpo de la solicitud

        const contactData = [
            {
                data: {
                    NOMBRE: nombre,
                    APELLIDO1: apellido,
                    TELEFONO: telefono,
                    MAIL: email
                },
                callable: true
            }
        ];

        await axios.post(`https://api.mypurecloud.ie/api/v2/outbound/contactlists/${contactListId}/contacts`, contactData, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        res.send('Contacto creado con éxito.');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al autenticar o crear el contacto.');
    }
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
