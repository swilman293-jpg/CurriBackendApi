// URL base de la API (Render). Cambiar aquí cuando se despliegue.
// Vacío = la misma aplicación sirve la API y las fotos (desarrollo).
window.API_BASE = '';

// Convierte una ruta de la API ('/api/...') en URL completa.
function apiUrl(ruta) {
    const base = (window.API_BASE || '').replace(/\/+$/, '');
    return base + ruta;
}

// Convierte una ruta de archivo ('/uploads/...') en URL completa.
function archivoUrl(ruta) {
    if (!ruta) return '';
    if (/^https?:\/\//i.test(ruta)) return ruta;
    const base = (window.API_BASE || '').replace(/\/+$/, '');
    return base + ruta;
}