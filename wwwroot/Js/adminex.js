document.addEventListener('DOMContentLoaded', () => {

    const form = document.getElementById('form-experiencia_laboral');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log("¡Click detectado!");
            console.log("FechaIni:", document.getElementById('ini').value);
            console.log("FechaFin:", document.getElementById('f').value);
            const nuevaExperiencia= {
                ID_Usuario: 1,
                Experiencia: document.getElementById('experiencia').value,
                Cargo: document.getElementById('cargo').value,
                FechaIni: document.getElementById('ini').value,
                FechaFin: document.getElementById('f').value
            };

            console.log("Enviando:", nuevaExperiencia);
            
            try {
                const response = await fetch('https://localhost:7179/api/Experiencia', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(nuevaExperiencia)
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
        console.error("Error: No se encontró el formulario con ID 'form-experiencia_laboral'");
    }

    
});