console.log("El archivo index.js se está ejecutando...");
import { crearCirculoNivel } from './components.js';
async function obtenerDatos(url, contenedorId, renderFunction) {
    try {
        const response = await fetch(url);
        const data = await response.json();

        const contenedor = document.getElementById(contenedorId);
        if (!contenedor) {
            console.error(`Contenedor con ID '${contenedorId}' no encontrado.`);
            return;
        }

        // 1. Creamos una variable para acumular todo el HTML
        let htmlFragment = '';

        // 2. Construimos todo el HTML en memoria
        data.forEach(item => {
            htmlFragment += renderFunction(item);
        });

        // 3. Inyectamos TODO de una sola vez al final
        contenedor.innerHTML = htmlFragment;

    } catch (error) {
        console.error(`Error al cargar ${url}:`, error);
    }
}
function desplazarA(id) {
    const elemento = document.getElementById(id);

    if (elemento) {
        console.log("Encontrar el elemento !Desplazando hacia:", id);
        
        elemento.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
        console.error("No se econtro el elemento con ID:", id);
    }
}
// Inicializar todo cuando la página cargue
window.onload = () => {
    document.querySelectorAll('.btn-nav').forEach(button => {
        button.addEventListener('mouseenter', (event) => {
            // Obtenemos el nombre de la sección del atributo data-id
            const seccion = event.target.getAttribute('data-id');
            desplazarA(seccion);
        });
    });
    // 1. Cargar Perfil
    obtenerDatos('/api/Usu', 'contenedor-perfil', (u) => `
<div class="perfil-card">
    <h1> Nombre: ${u.nombre || ''} ${u.apellido || ''}</h1>
    <p>Titulo profesional: ${u.tituloProfesional || ''}</p>
    <p>Me defino como persona: ${u.acercaDe || ''}</p>
    <p>Email: ${u.email || ''}</p>
    <p>Telefono: ${u.telefono || ''}</p>

</div>
    `);

    // 2. Cargar Experiencia
    obtenerDatos('/api/Experiencia', 'contenedor-experiencia', (e) => `
        <div class="resume-item">
            <h4>${e.cargo}</h4>
            <p><strong>Empresa:</strong> ${e.experiencia}</p>
           
            <p>Fecha Inicio: ${e.fechaIni.split("T")[0]}</p>
            <p>Fecha Fin: ${e.fechaFin.split("T")[0]}</p>
        </div>
    `);

    // 3. Cargar Educación
    obtenerDatos('/api/Educacion', 'lista-educacion', (ed) => `
        <div class="resume-item">
            <h4>Institución: ${ed.institución}</h4>
            <p>Titulo: ${ed.titulo_Obtenido}</p>
            <p>Fecha Inicio: ${ed.fecha_Inicio.split("T")[0]}</p>
            <p>Fecha Fin: ${ed.fecha_Fin.split("T")[0]}</p>
        </div>
    `);
    // 3. Cargar Habilidad
    obtenerDatos('/api/Habilidades', 'lista-tecnologias', (h) => {
        
        const circuloHTML = crearCirculoNivel(h.nivel);
        console.log(circuloHTML);
        return `
    <div class="resume-item">
        <h4>Lenguaje de programación: ${h.nombre}</h4>
        ${circuloHTML}
    </div>
    `});
};
