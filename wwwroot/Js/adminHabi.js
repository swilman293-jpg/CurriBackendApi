document.addEventListener('DOMContentLoaded', () => {

    const form = document.getElementById('form-tecnologias');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log("¡Click detectado!");

            const nuevaHabilidad = {
                ID_Usuario: 1,
                Nombre: document.getElementById('nombre').value,
                Nivel: document.getElementById('nivel').value,

            };

            console.log("Enviando:", nuevaHabilidad);

            try {
                const response = await fetch('https://localhost:7179/api/Habilidades', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(nuevaHabilidad)
                });

                if (response.ok) {
                    alert("¡Guardado con éxito!");
                } else {
                    const errorText = await response.text();
                    alert("Error del servidor: " + response.status + " - " + errorText);
                }
            } catch (err) {
                console.error("Error de conexión:", err);
                alert("No se pudo conectar con la API.");
            }
        });
    } else {
        console.error("Error: No se encontró el formulario con Id 'tecnologias'");
    }


});