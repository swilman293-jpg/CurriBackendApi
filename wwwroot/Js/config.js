// URL base de la API (Render). Cambiar aquí cuando se despliegue.
// Vacío = la misma aplicación sirve la API y las fotos (desarrollo).
window.API_BASE = 'https://curribackendapi-1.onrender.com';

// Convierte una ruta de la API ('/api/...') en URL completa.
window.apiUrl = function(ruta) {
    const base = (window.API_BASE || '').replace(/\/+$/, '');
    return base + ruta;
};

// Convierte una ruta de archivo ('/uploads/...') en URL completa.
window.archivoUrl = function(ruta) {
    if (!ruta) return '';
    if (/^https?:\/\//i.test(ruta)) return ruta;
    const base = (window.API_BASE || '').replace(/\/+$/, '');
    return base + ruta;
};

// Transformación Cloudinary: reescribe URL para servir imagen optimizada
window.cdnUrl = function(ruta, ancho) {
    if (!ruta) return '';
    ancho = ancho || 900;
    if (/res\.cloudinary\.com\/.+\/image\/upload\//.test(ruta)) {
        return ruta.replace(
            '/image/upload/',
            '/image/upload/w_' + ancho + ',q_auto,f_auto,c_limit/'
        );
    }
    return window.archivoUrl(ruta);
};