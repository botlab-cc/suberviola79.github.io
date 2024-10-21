document.addEventListener("DOMContentLoaded", function () {
    const toggleButton = document.getElementById("toggleButton");
    const modal = document.getElementById("myModal");
    const closeButton = document.getElementsByClassName("close")[0];
    const callbackForm = document.getElementById("callbackForm");

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

    // Manejar el envío del formulario
    callbackForm.onsubmit = async function (e) {
        e.preventDefault(); // Evitar el envío del formulario

        const name = document.getElementById("name").value;
        const phone = document.getElementById("phone").value;
        const surname = document.getElementById("surname").value; // Apellido 1
        const email = document.getElementById("email").value; // Email

        // Aquí puedes manejar los datos y llamar a la función para crear contacto
        alert(`Nombre: ${name}, Teléfono: ${phone}, Apellido: ${surname}, Email: ${email}`);

        // Aquí puedes añadir la lógica para llamar a tu API de Genesys y crear el contacto
        try {
            const response = await createContact(name, phone, surname, email);
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

    // Simulación de función para crear un contacto (puedes sustituirla con tu lógica)
    async function createContact(name, phone, surname, email) {
        // Aquí deberías hacer la llamada a tu API
        console.log("Creando contacto:", { name, phone, surname, email });
        return { ok: true }; // Simulación de respuesta exitosa
    }
});
