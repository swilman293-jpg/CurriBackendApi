console.log("El archivo index.js se está ejecutando...");
document.body.classList.add('js-anim');
import { crearCirculoNivel } from './components.js';
async function obtenerDatos(url, contenedorId, renderFunction) {
    try {
        const response = await fetch(apiUrl(url));
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

        marcarReveal(contenedor);

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
// Reveal on scroll
let revealObserver = null;

function initRevealObserver() {
    if (revealObserver) return;
    revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(en => {
            if (en.isIntersecting) {
                en.target.classList.add('reveal-visible');
                revealObserver.unobserve(en.target);
            }
        });
    }, { threshold: 0.12 });
}

function observarReveal(raiz) {
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        initRevealObserver();
        (raiz || document).querySelectorAll('.reveal:not(.reveal-visible)').forEach(el => revealObserver.observe(el));
    }
}

function marcarReveal(contenedor) {
    Array.from(contenedor.children).forEach((el, i) => {
        el.classList.add('reveal');
        el.style.setProperty('--i', i);
    });
    observarReveal(contenedor);
}
const SVG_EMAIL = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>';
const SVG_PHONE = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>';
const SVG_GITHUB = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5A11.5 11.5 0 0 0 .5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-1.95c-3.2.7-3.87-1.54-3.87-1.54-.52-1.34-1.28-1.7-1.28-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.2 1.77 1.2 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.28-5.23-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.18 1.18a11.04 11.04 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.77.11 3.06.74.81 1.19 1.83 1.19 3.09 0 4.42-2.69 5.39-5.25 5.68.41.35.77 1.05.77 2.12v3.14c0 .31.2.67.8.55A11.5 11.5 0 0 0 23.5 12 11.5 11.5 0 0 0 12 .5z"></path></svg>';

function chipContacto(href, icono, texto, esExterno) {
    if (!href) return '';
    const target = esExterno ? ' target="_blank" rel="noopener"' : '';
    return `<a class="chip-contacto" href="${href}"${target}><span class="chip-ico">${icono}</span>${texto}</a>`;
}

// Stats del hero con conteo animado
const MAX_ANIOS_EXPERIENCIA = 1;

function calcularAnios(exp) {
    let min = null;
    (Array.isArray(exp) ? exp : []).forEach(e => {
        const fecha = e.fechaIni ? new Date(e.fechaIni) : null;
        if (fecha && !isNaN(fecha) && (!min || fecha < min)) min = fecha;
    });
    if (!min) return 0;
    const calculado = Math.max(0, Math.floor((Date.now() - min.getTime()) / (1000 * 60 * 60 * 24 * 365.25)));
    return Math.min(calculado, MAX_ANIOS_EXPERIENCIA);
}

function animarNumero(el, final, sufijo) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        el.innerHTML = final + `<span class="stat-sufijo">${sufijo}</span>`;
        return;
    }
    const duracion = 900;
    const inicio = performance.now();
    const textoSufijo = sufijo;
    function paso(ahora) {
        const t = Math.min((ahora - inicio) / duracion, 1);
        const suavizado = 1 - Math.pow(1 - t, 3);
        const val = Math.round(final * suavizado);
        el.innerHTML = val + `<span class="stat-sufijo">${textoSufijo}</span>`;
        if (t < 1) requestAnimationFrame(paso);
    }
    requestAnimationFrame(paso);
}

async function cargarStats() {
    const statsEl = document.getElementById('stats-hero');
    if (!statsEl) return;
    try {
        const [rU, rE, rEx, rH, rP] = await Promise.all([
            fetch(apiUrl('/api/Usu')), fetch(apiUrl('/api/Educacion')), fetch(apiUrl('/api/Experiencia')),
            fetch(apiUrl('/api/Habilidades')), fetch(apiUrl('/api/Prueba'))
        ]);
        const u = await rU.json();
        const edu = await rE.json();
        const exp = await rEx.json();
        const hab = await rH.json();
        const prue = await rP.json();
        const stats = [
            { valor: calcularAnios(exp), sufijo: ' +', etiqueta: 'Años de experiencia' },
            { valor: Array.isArray(hab) ? hab.length : 0, sufijo: '', etiqueta: 'Lenguajes' },
            { valor: Array.isArray(edu) ? edu.length : 0, sufijo: '', etiqueta: 'Formaciones' },
            { valor: Array.isArray(prue) ? prue.length : 0, sufijo: '', etiqueta: 'Evidencias' }
        ];
        statsEl.innerHTML = stats.map((s, i) => `
            <div class="stat-item reveal" style="--i:${i}">
                <div class="stat-valor" data-final="${s.valor}" data-sufijo="${s.sufijo}">0<span class="stat-sufijo">${s.sufijo}</span></div>
                <div class="stat-etiqueta">${s.etiqueta}</div>
            </div>`).join('');
        observarReveal(statsEl);
        statsEl.querySelectorAll('.stat-valor').forEach(el => {
            animarNumero(el, Number(el.dataset.final), el.dataset.sufijo);
        });
    } catch (error) {
        console.error('Error al cargar las estadísticas:', error);
    }
}

// Lightbox con navegación
let pruebasLista = [];
let luzIndice = 0;

function pintarLuz() {
    const p = pruebasLista[luzIndice];
    const img = document.getElementById('imagen-luz');
    img.src = archivoUrl(p.imagenUrl);
    document.getElementById('luz-contador').textContent = (luzIndice + 1) + ' / ' + pruebasLista.length;
    document.getElementById('luz-caption').textContent = p.descripcion || '';
    document.getElementById('luz-prev').disabled = pruebasLista.length <= 1;
    document.getElementById('luz-next').disabled = pruebasLista.length <= 1;
}

function luzNav(dir) {
    if (!pruebasLista.length) return;
    luzIndice = (luzIndice + dir + pruebasLista.length) % pruebasLista.length;
    pintarLuz();
}

function abrirLightbox(idx) {
    if (!pruebasLista.length) return;
    luzIndice = idx;
    pintarLuz();
    new bootstrap.Modal(document.getElementById('modal-luz')).show();
}

function luzTeclado(e) {
    if (e.key === 'ArrowLeft') luzNav(-1);
    if (e.key === 'ArrowRight') luzNav(1);
}

const modalLuzEl = document.getElementById('modal-luz');
if (modalLuzEl) {
    modalLuzEl.addEventListener('shown.bs.modal', () => document.addEventListener('keydown', luzTeclado));
    modalLuzEl.addEventListener('hidden.bs.modal', () => document.removeEventListener('keydown', luzTeclado));
    document.getElementById('luz-prev').addEventListener('click', () => luzNav(-1));
    document.getElementById('luz-next').addEventListener('click', () => luzNav(1));
}

// Footer con redes del perfil
async function cargarFooter() {
    try {
        const response = await fetch(apiUrl('/api/Usu'));
        const data = await response.json();
        const perfil = Array.isArray(data) ? data[0] : null;
        if (!perfil) return;
        const github = document.getElementById('link-github');
        const email = document.getElementById('link-email');
        const anio = document.getElementById('anio');
        if (github && perfil.githubUrl) github.href = perfil.githubUrl;
        if (email && perfil.email) { email.href = 'mailto:' + perfil.email; email.textContent = perfil.email; }
        if (anio) anio.textContent = new Date().getFullYear();
    } catch (error) {
        console.error('Error al cargar el footer:', error);
    }
}
// Cargar Pruebas y abrir lightbox al hacer clic en la imagen
const hoverFino = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const motionOK = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function aplicarTilt(tarjetas) {
    tarjetas.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const r = card.getBoundingClientRect();
            const x = (e.clientX - r.left) / r.width - 0.5;
            const y = (e.clientY - r.top) / r.height - 0.5;
            card.style.transform =
                `perspective(900px) rotateX(${(-y * 8).toFixed(2)}deg) rotateY(${(x * 8).toFixed(2)}deg) translateY(-6px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

function setPaginaPrueba(foto, sig) {
    const portada = foto.querySelector('.prueba-portada');
    const paginas = portada.querySelectorAll('.prueba-pagina');
    sig = (sig + paginas.length) % paginas.length;
    portada.querySelectorAll('.prueba-pagina').forEach((pg, i) => pg.classList.toggle('activa', i === sig));
    foto.querySelectorAll('.prueba-thumb').forEach((t, i) => t.classList.toggle('activa', i === sig));
    const contador = portada.querySelector('.prueba-contador');
    if (contador) contador.textContent = (sig + 1) + ' / ' + paginas.length;
    return sig;
}

function abrirPagina(foto, sig) {
    sig = setPaginaPrueba(foto, sig);
    const id = foto.querySelectorAll('.prueba-pagina')[sig].querySelector('.prueba-img').dataset.id;
    const idx = pruebasLista.findIndex(p => String(p.id) === String(id));
    abrirLightbox(idx >= 0 ? idx : 0);
}

async function cargarPruebas() {
    try {
        const response = await fetch(apiUrl('/api/Prueba'));
        const data = await response.json();
        const contenedor = document.getElementById('contenedor-pruebas');
        if (!contenedor) return;

        const lista = Array.isArray(data) ? data : [];
        pruebasLista = lista.filter(p => !!p.imagenUrl);

        const conImg = lista.filter(p => !!p.imagenUrl);
        const sinImg = lista.filter(p => !p.imagenUrl);

        const gruposMap = new Map();
        conImg.forEach(p => {
            const clave = (p.grupo || '').trim() || ('ind-' + p.id);
            if (!gruposMap.has(clave)) gruposMap.set(clave, []);
            gruposMap.get(clave).push(p);
        });

        const tarjetaSinFoto = (p, gi) => `
            <div class="col-md-6 col-lg-4 mb-4 reveal" style="--i:${gi}">
                <div class="card h-100 shadow-sm prueba-card">
                    <div class="card-body">
                        <p class="card-text text-start m-0 prueba-desc">${p.descripcion || ''}</p>
                    </div>
                </div>
            </div>`;

        let gi = 0;
        const htmlGrupos = Array.from(gruposMap.values()).map(g => {
            const items = g.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            const agrupado = items.length > 1;
            const fecha = new Date(items[0].createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
            const foto = `
                <div class="prueba-foto">
                    <div class="prueba-portada">
                        ${items.map((p, ii) => `
                            <div class="prueba-pagina ${ii === 0 ? 'activa' : ''}">
                                <img src="${archivoUrl(p.imagenUrl)}" class="prueba-img" alt="Evidencia" data-id="${p.id}" style="cursor:pointer">
                            </div>`).join('')}
                        <span class="badge-ev">EVIDENCIA</span>
                        <span class="prueba-fecha">${fecha}</span>
                        ${agrupado ? `
                            <span class="prueba-contador">1 / ${items.length}</span>
                            <button type="button" class="prueba-flecha prueba-prev" aria-label="Anterior">‹</button>
                            <button type="button" class="prueba-flecha prueba-next" aria-label="Siguiente">›</button>` : ''}
                    </div>
                    ${agrupado ? `
                        <div class="prueba-strip">
                            ${items.map((p, ii) => `
                                <button type="button" class="prueba-thumb ${ii === 0 ? 'activa' : ''}" data-page="${ii}" aria-label="Foto ${ii + 1}">
                                    <img src="${archivoUrl(p.imagenUrl)}" alt="">
                                </button>`).join('')}
                        </div>` : ''}
                </div>`;
            const html = `
                <div class="col-md-6 col-lg-4 mb-4 reveal" style="--i:${gi}">
                    <div class="card h-100 shadow-sm prueba-card">
                        ${foto}
                        <div class="card-body">
                            <p class="card-text text-start m-0 prueba-desc">${items[0].descripcion || ''}</p>
                        </div>
                    </div>
                </div>`;
            gi++;
            return html;
        });

        const htmlSinFoto = sinImg.map(p => tarjetaSinFoto(p, gi++));
        contenedor.innerHTML = htmlGrupos.join('') + htmlSinFoto.join('');

        contenedor.querySelectorAll('.prueba-img').forEach(img => {
            img.addEventListener('click', () => {
                const idx = pruebasLista.findIndex(p => String(p.id) === String(img.dataset.id));
                abrirLightbox(idx >= 0 ? idx : 0);
            });
        });

        contenedor.querySelectorAll('.prueba-flecha').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const foto = btn.closest('.prueba-foto');
                const dir = btn.classList.contains('prueba-next') ? 1 : -1;
                const actual = Array.from(foto.querySelectorAll('.prueba-pagina')).findIndex(pg => pg.classList.contains('activa'));
                setPaginaPrueba(foto, actual + dir);
            });
        });

        contenedor.querySelectorAll('.prueba-thumb').forEach(thumb => {
            thumb.addEventListener('click', () => {
                abrirPagina(thumb.closest('.prueba-foto'), Number(thumb.dataset.page));
            });
        });

        observarReveal(contenedor);

        if (hoverFino && motionOK) {
            aplicarTilt(contenedor.querySelectorAll('.prueba-card'));
        }
    } catch (error) {
        console.error('Error al cargar las pruebas:', error);
    }
}
// Inicializar todo cuando la página cargue
window.onload = () => {
    observarReveal(document);
    cargarFooter();
    cargarStats();
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
    <span class="perfil-estrella">Sobre mí</span>
    <h2 class="perfil-nombre">${u.nombre || ''} ${u.apellido || ''}</h2>
    <p class="perfil-titulo">${u.tituloProfesional || ''}</p>
    <p class="perfil-texto">${u.acercaDe || ''}</p>
    <div class="perfil-contacto">
        ${chipContacto(u.email ? 'mailto:' + u.email : '', SVG_EMAIL, u.email || 'Email', false)}
        ${chipContacto(u.telefono ? 'tel:' + u.telefono : '', SVG_PHONE, u.telefono || 'Teléfono', false)}
        ${chipContacto(u.githubUrl, SVG_GITHUB, 'GitHub', true)}
    </div>
</div>
    `);

    // 2. Cargar Experiencia
    obtenerDatos('/api/Experiencia', 'contenedor-experiencia', (e) => `
        <div class="resume-item">
            <h4>${e.cargo}</h4>
            <p><strong>A cargo de:</strong> ${e.experiencia}</p>
           
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

    // 4. Cargar Pruebas (evidencias)
    cargarPruebas();
};
