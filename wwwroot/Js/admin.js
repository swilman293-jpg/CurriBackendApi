document.addEventListener('DOMContentLoaded', () => {

    const form = document.getElementById('form-educacion');

    if (form) {
        form.addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log("¡Click detectado!");

        const nuevaEducacion = {
            ID_Usuario: 1,
            Institución: document.getElementById('institucion').value,
            Titulo_Obtenido: document.getElementById('titulo').value,
            Fecha_Inicio: document.getElementById('inicio').value,
            Fecha_Fin: document.getElementById('fin').value
        };

        console.log("Enviando:", nuevaEducacion);

        try {
            const response = await fetch('https://localhost:7179/api/Educacion', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(nuevaEducacion)
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
        console.error("Error: No se encontró el formulario con ID 'form-educacion'");
    }

});