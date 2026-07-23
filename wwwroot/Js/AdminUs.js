document.addEventListener('DOMContentLoaded', () => {

    const form = document.getElementById('form-Usuarios');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log("¡Click detectado!");

            const nuevaUsuario = {
                
                Nombre: document.getElementById('nomb').value,
                Apellido: document.getElementById('apellido').value,
                TituloProfesional: document.getElementById('titu').value,
                AcercaDe: document.getElementById('acerca').value,
                Email: document.getElementById('email').value,
                Telefono: document.getElementById('telef').value,
                LinkedinUrl: document.getElementById('link').value,
                GithubUrl: document.getElementById('gith').value,

            };

            console.log("Enviando:", nuevaUsuario);

            try {
                const response = await fetch('/api/Usu', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(nuevaUsuario)
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
        console.error("Error: No se encontró el formulario con Id 'Usuarios'");
    }


});