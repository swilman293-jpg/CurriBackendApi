/*async function obtenerDatos() {
    try {
        // La URL debe ser exactamente la de tu endpoint GET
        const response = await fetch('/api/Usu');
        const datos = await response.json();

        const contenedor = document.getElementById('contenedor-perfil');
        contenedor.innerHTML = ''; // Limpiar antes de llenar

        // Recorremos los usuarios obtenidos
        datos.forEach(user => {
            contenedor.innerHTML += `
                <div class="perfil-info">
                    <h2>${user.nombre} ${user.apellido}</h2>
                    <p><strong>Profesión:</strong> ${user.tituloProfesional}</p>
                    <p><strong>Sobre mí:</strong> ${user.acercaDe}</p>
                </div>
            `;
        });
    } catch (error) {
        console.error("Error al obtener los datos:", error);
    }
}

// Ejecutar al cargar la página
window.onload = obtenerDatos;