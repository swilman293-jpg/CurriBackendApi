export function crearCirculoNivel(nivel) {
    const valor = nivel ? nivel.toLowerCase().trim() : '';
    let clase = 'basico';
    let etiqueta = 'Básico';

    if (valor.includes('avanzado') || valor === 'alto') {
        clase = 'avanzado';
        etiqueta = 'Avanzado';
    } else if (valor.includes('intermedio') || valor === 'medio') {
        clase = 'intermedio';
        etiqueta = 'Intermedio';
    } else if (valor.includes('proceso')) {
        return `<div class="nivel-visual"><div class="spinner"></div><span class="nivel-texto">${nivel}</span></div>`;
    } else if (valor.includes('básico') || valor.includes('basico') || valor === 'bajo') {
        clase = 'basico';
        etiqueta = 'Básico';
    }

    return `<div class="nivel-visual"><div class="circulo-nivel ${clase}"></div><span class="nivel-texto">${etiqueta}</span></div>`;
}
