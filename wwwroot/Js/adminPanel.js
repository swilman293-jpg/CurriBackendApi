let usuarioActivoId = null;

function obtenerToken() {
    return localStorage.getItem('adminToken');
}

function obtenerAdminEmail() {
    return localStorage.getItem('adminEmail') || '';
}

async function api(url, metodo = 'GET', body = null, esForm = false) {
    const opciones = { method: metodo, headers: {} };
    const token = obtenerToken();
    if (token) opciones.headers['Authorization'] = 'Bearer ' + token;
    if (body) {
        if (esForm) {
            opciones.body = body;
        } else {
            opciones.headers['Content-Type'] = 'application/json';
            opciones.body = JSON.stringify(body);
        }
    }
    return fetch(apiUrl(url), opciones);
}

function mostrarAlerta(id, mensaje, tipo) {
    const cont = document.getElementById(id);
    if (!cont) return;
    cont.innerHTML = `<div class="alert alert-${tipo} alert-dismissible fade show" role="alert">${mensaje}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button></div>`;
    setTimeout(() => { cont.innerHTML = ''; }, 6000);
}

function abrirAdmin() {
    if (!obtenerToken()) {
        document.getElementById('alerta-login').innerHTML = '';
        new bootstrap.Modal(document.getElementById('modal-login')).show();
    } else {
        abrirPanel();
    }
}

async function abrirPanel() {
    const resp = await api('/api/Auth/verificar');
    if (resp.status === 401) {
        cerrarSesion();
        alert('Tu sesión expiró. Inicia sesión nuevamente.');
        return;
    }
    const modalLogin = bootstrap.Modal.getInstance(document.getElementById('modal-login'));
    if (modalLogin) modalLogin.hide();
    document.getElementById('login-password').value = '';
    new bootstrap.Modal(document.getElementById('modal-panel')).show();
    cargarTodoAdmin();
}

function cerrarPanel() {
    const modal = bootstrap.Modal.getInstance(document.getElementById('modal-panel'));
    if (modal) modal.hide();
}

function cerrarSesion() {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminEmail');
    const modal = bootstrap.Modal.getInstance(document.getElementById('modal-panel'));
    if (modal) modal.hide();
    alert('Sesión cerrada correctamente.');
}

async function cargarTodoAdmin() {
    usuarioActivoId = null;
    await Promise.all([
        cargarUsuariosAdmin(),
        cargarEducacionesAdmin(),
        cargarExperienciasAdmin(),
        cargarTecnologiasAdmin(),
        cargarPruebasAdmin()
    ]);
}

document.getElementById('form-login').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    try {
        const resp = await fetch(apiUrl('/api/Auth/login'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await resp.json();
        if (!resp.ok) {
            mostrarAlerta('alerta-login', data.message || data.title || 'Credenciales incorrectas.', 'danger');
            return;
        }
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminEmail', email);
        document.getElementById('login-email').value = '';
        document.getElementById('login-password').value = '';
        document.getElementById('alerta-login').innerHTML = '';
        abrirPanel();
    } catch (error) {
        mostrarAlerta('alerta-login', 'No se pudo conectar con el servidor.', 'danger');
    }
});

// ---------- PERFIL (Usuarios) ----------
async function cargarUsuariosAdmin() {
    const resp = await api('/api/Usu');
    const lista = await resp.json();
    if (Array.isArray(lista) && lista.length > 0) {
        usuarioActivoId = lista[0].iD_Usuario || lista[0].id;
    }
    const cont = document.getElementById('listado-usuarios');
    if (!Array.isArray(lista) || lista.length === 0) {
        cont.innerHTML = '<div class="text-muted">No hay perfiles registrados.</div>';
        return;
    }
    cont.dataset.lista = JSON.stringify(lista);
    cont.innerHTML = lista.map(u => `
        <div class="item-admin">
            <div class="flex-grow-1">
                <strong>${u.nombre || ''} ${u.apellido || ''}</strong>
                <div class="text-muted small">${u.tituloProfesional || ''} · ${u.email || ''}</div>
            </div>
            <div class="botones-item">
                <button class="btn btn-sm btn-outline-primary" onclick="editarUsuario(${u.iD_Usuario})">Editar</button>
                <button class="btn btn-sm btn-outline-danger" onclick="eliminarUsuario(${u.iD_Usuario})">Eliminar</button>
            </div>
        </div>`).join('');
}

function editarUsuario(id) {
    const cont = document.getElementById('listado-usuarios');
    const u = JSON.parse(cont.dataset.lista || '[]').find(x => x.iD_Usuario === id);
    if (!u) return;
    document.getElementById('usuario-id').value = u.iD_Usuario;
    document.getElementById('usuario-nombre').value = u.nombre || '';
    document.getElementById('usuario-apellido').value = u.apellido || '';
    document.getElementById('usuario-titulo').value = u.tituloProfesional || '';
    document.getElementById('usuario-acercade').value = u.acercaDe || '';
    document.getElementById('usuario-email').value = u.email || '';
    document.getElementById('usuario-telefono').value = u.telefono || '';
    document.getElementById('usuario-github').value = u.githubUrl || '';
    document.getElementById('btn-usuario-guardar').textContent = 'Actualizar';
    cancelarEdicionBotones('usuario');
}

async function eliminarUsuario(id) {
    if (!confirm('¿Seguro que deseas eliminar este perfil?')) return;
    const resp = await api('/api/Usu/' + id, 'DELETE');
    if (resp.ok) { mostrarAlerta('alerta-panel', 'Perfil eliminado.', 'success'); cargarTodoAdmin(); }
    else mostrarAlerta('alerta-panel', 'Error al eliminar.', 'danger');
}

document.getElementById('form-usuario').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('usuario-id').value;
    const body = {
        nombre: document.getElementById('usuario-nombre').value.trim(),
        apellido: document.getElementById('usuario-apellido').value.trim(),
        tituloProfesional: document.getElementById('usuario-titulo').value.trim(),
        acercaDe: document.getElementById('usuario-acercade').value.trim(),
        email: document.getElementById('usuario-email').value.trim(),
        telefono: document.getElementById('usuario-telefono').value.trim(),
        githubUrl: document.getElementById('usuario-github').value.trim()
    };
    const resp = id ? await api('/api/Usu/' + id, 'PUT', body) : await api('/api/Usu', 'POST', body);
    if (resp.ok) {
        mostrarAlerta('alerta-panel', 'Perfil guardado correctamente.', 'success');
        document.getElementById('form-usuario').reset();
        document.getElementById('usuario-id').value = '';
        document.getElementById('btn-usuario-guardar').textContent = 'Guardar';
        cargarUsuariosAdmin();
    } else {
        mostrarAlerta('alerta-panel', 'Error al guardar el perfil.', 'danger');
    }
});

// ---------- EDUCACIÓN ----------
async function cargarEducacionesAdmin() {
    const resp = await api('/api/Educacion');
    const lista = await resp.json();
    const cont = document.getElementById('listado-educaciones');
    if (!Array.isArray(lista) || lista.length === 0) {
        cont.innerHTML = '<div class="text-muted">No hay educación registrada.</div>';
        return;
    }
    cont.dataset.lista = JSON.stringify(lista);
    cont.innerHTML = lista.map(ed => `
        <div class="item-admin">
            <div class="flex-grow-1">
                <strong>${ed.institución || ''}</strong>
                <div class="text-muted small">${ed.titulo_Obtenido || ''}</div>
            </div>
            <div class="botones-item">
                <button class="btn btn-sm btn-outline-primary" onclick="editarEducacion(${ed.id_Edu})">Editar</button>
                <button class="btn btn-sm btn-outline-danger" onclick="eliminarEducacion(${ed.id_Edu})">Eliminar</button>
            </div>
        </div>`).join('');
}

function editarEducacion(id) {
    const cont = document.getElementById('listado-educaciones');
    const ed = JSON.parse(cont.dataset.lista || '[]').find(x => x.id_Edu === id);
    if (!ed) return;
    document.getElementById('educacion-id').value = ed.id_Edu;
    document.getElementById('educacion-institucion').value = ed.institución || '';
    document.getElementById('educacion-titulo').value = ed.titulo_Obtenido || '';
    document.getElementById('educacion-fechainicio').value = (ed.fecha_Inicio || '').split('T')[0];
    document.getElementById('educacion-fechafin').value = (ed.fecha_Fin || '').split('T')[0];
    cancelarEdicionBotones('educacion');
}

async function eliminarEducacion(id) {
    if (!confirm('¿Seguro que deseas eliminar esta educación?')) return;
    const resp = await api('/api/Educacion/' + id, 'DELETE');
    if (resp.ok) { mostrarAlerta('alerta-panel', 'Educación eliminada.', 'success'); cargarEducacionesAdmin(); }
    else mostrarAlerta('alerta-panel', 'Error al eliminar.', 'danger');
}

document.getElementById('form-educacion').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('educacion-id').value;
    const body = {
        iD_Usuario: usuarioActivoId || 1,
        institución: document.getElementById('educacion-institucion').value.trim(),
        titulo_Obtenido: document.getElementById('educacion-titulo').value.trim(),
        fecha_Inicio: document.getElementById('educacion-fechainicio').value,
        fecha_Fin: document.getElementById('educacion-fechafin').value
    };
    const resp = id ? await api('/api/Educacion/' + id, 'PUT', body) : await api('/api/Educacion', 'POST', body);
    if (resp.ok) {
        mostrarAlerta('alerta-panel', 'Educación guardada correctamente.', 'success');
        document.getElementById('form-educacion').reset();
        document.getElementById('educacion-id').value = '';
        cargarEducacionesAdmin();
    } else {
        mostrarAlerta('alerta-panel', 'Error al guardar la educación.', 'danger');
    }
});

// ---------- EXPERIENCIA ----------
async function cargarExperienciasAdmin() {
    const resp = await api('/api/Experiencia');
    const lista = await resp.json();
    const cont = document.getElementById('listado-experiencias');
    if (!Array.isArray(lista) || lista.length === 0) {
        cont.innerHTML = '<div class="text-muted">No hay experiencias registradas.</div>';
        return;
    }
    cont.dataset.lista = JSON.stringify(lista);
    cont.innerHTML = lista.map(ex => `
        <div class="item-admin">
            <div class="flex-grow-1">
                <strong>${ex.cargo || ''}</strong>
                <div class="text-muted small">${ex.experiencia || ''}</div>
            </div>
            <div class="botones-item">
                <button class="btn btn-sm btn-outline-primary" onclick="editarExperiencia(${ex.id_Expe})">Editar</button>
                <button class="btn btn-sm btn-outline-danger" onclick="eliminarExperiencia(${ex.id_Expe})">Eliminar</button>
            </div>
        </div>`).join('');
}

function editarExperiencia(id) {
    const cont = document.getElementById('listado-experiencias');
    const ex = JSON.parse(cont.dataset.lista || '[]').find(x => x.id_Expe === id);
    if (!ex) return;
    document.getElementById('experiencia-id').value = ex.id_Expe;
    document.getElementById('experiencia-lugar').value = ex.experiencia || '';
    document.getElementById('experiencia-cargo').value = ex.cargo || '';
    document.getElementById('experiencia-fechainicio').value = (ex.fechaIni || '').split('T')[0];
    document.getElementById('experiencia-fechafin').value = (ex.fechaFin || '').split('T')[0];
    cancelarEdicionBotones('experiencia');
}

async function eliminarExperiencia(id) {
    if (!confirm('¿Seguro que deseas eliminar esta experiencia?')) return;
    const resp = await api('/api/Experiencia/' + id, 'DELETE');
    if (resp.ok) { mostrarAlerta('alerta-panel', 'Experiencia eliminada.', 'success'); cargarExperienciasAdmin(); }
    else mostrarAlerta('alerta-panel', 'Error al eliminar.', 'danger');
}

document.getElementById('form-experiencia').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('experiencia-id').value;
    const body = {
        iD_Usuario: usuarioActivoId || 1,
        experiencia: document.getElementById('experiencia-lugar').value.trim(),
        cargo: document.getElementById('experiencia-cargo').value.trim(),
        fechaIni: document.getElementById('experiencia-fechainicio').value,
        fechaFin: document.getElementById('experiencia-fechafin').value
    };
    const resp = id ? await api('/api/Experiencia/' + id, 'PUT', body) : await api('/api/Experiencia', 'POST', body);
    if (resp.ok) {
        mostrarAlerta('alerta-panel', 'Experiencia guardada correctamente.', 'success');
        document.getElementById('form-experiencia').reset();
        document.getElementById('experiencia-id').value = '';
        cargarExperienciasAdmin();
    } else {
        mostrarAlerta('alerta-panel', 'Error al guardar la experiencia.', 'danger');
    }
});

// ---------- TECNOLOGÍAS ----------
async function cargarTecnologiasAdmin() {
    const resp = await api('/api/Habilidades');
    const lista = await resp.json();
    const cont = document.getElementById('listado-tecnologias-admin');
    if (!Array.isArray(lista) || lista.length === 0) {
        cont.innerHTML = '<div class="text-muted">No hay tecnologías registradas.</div>';
        return;
    }
    cont.dataset.lista = JSON.stringify(lista);
    cont.innerHTML = lista.map(t => `
        <div class="item-admin">
            <div class="flex-grow-1">
                <strong>${t.nombre || ''}</strong>
                <div class="text-muted small">Nivel: ${t.nivel || ''}</div>
            </div>
            <div class="botones-item">
                <button class="btn btn-sm btn-outline-primary" onclick="editarTecnologia(${t.id_tecnologia})">Editar</button>
                <button class="btn btn-sm btn-outline-danger" onclick="eliminarTecnologia(${t.id_tecnologia})">Eliminar</button>
            </div>
        </div>`).join('');
}

function editarTecnologia(id) {
    const cont = document.getElementById('listado-tecnologias-admin');
    const t = JSON.parse(cont.dataset.lista || '[]').find(x => x.id_tecnologia === id);
    if (!t) return;
    document.getElementById('tecnologia-id').value = t.id_tecnologia;
    document.getElementById('tecnologia-nombre').value = t.nombre || '';
    document.getElementById('tecnologia-nivel').value = t.nivel || 'Basico';
    cancelarEdicionBotones('tecnologia');
}

async function eliminarTecnologia(id) {
    if (!confirm('¿Seguro que deseas eliminar esta tecnología?')) return;
    const resp = await api('/api/Habilidades/' + id, 'DELETE');
    if (resp.ok) { mostrarAlerta('alerta-panel', 'Tecnología eliminada.', 'success'); cargarTecnologiasAdmin(); }
    else mostrarAlerta('alerta-panel', 'Error al eliminar.', 'danger');
}

document.getElementById('form-tecnologia').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('tecnologia-id').value;
    const body = {
        iD_Usuario: usuarioActivoId || 1,
        nombre: document.getElementById('tecnologia-nombre').value.trim(),
        nivel: document.getElementById('tecnologia-nivel').value
    };
    const resp = id ? await api('/api/Habilidades/' + id, 'PUT', body) : await api('/api/Habilidades', 'POST', body);
    if (resp.ok) {
        mostrarAlerta('alerta-panel', 'Tecnología guardada correctamente.', 'success');
        document.getElementById('form-tecnologia').reset();
        document.getElementById('tecnologia-id').value = '';
        cargarTecnologiasAdmin();
    } else {
        mostrarAlerta('alerta-panel', 'Error al guardar la tecnología.', 'danger');
    }
});

// ---------- PRUEBAS ----------
async function cargarPruebasAdmin() {
    const resp = await api('/api/Prueba');
    const lista = await resp.json();
    const cont = document.getElementById('listado-pruebas-admin');
    if (!Array.isArray(lista) || lista.length === 0) {
        cont.innerHTML = '<div class="text-muted">No hay pruebas registradas.</div>';
        return;
    }
    cont.dataset.lista = JSON.stringify(lista);
    cont.innerHTML = lista.map(p => `
        <div class="item-admin">
            <div class="flex-grow-1">
                <strong>${p.descripcion || ''}</strong>
                ${p.grupo ? ` <span class="badge bg-info text-dark">${p.grupo}</span>` : ''}
                <div class="text-muted small">${p.usuarioEmail || ''} · ${(p.createdAt || '').replace('T', ' ').split('.')[0]}</div>
            </div>
            <div class="botones-item">
                ${p.imagenUrl ? `<a class="btn btn-sm btn-outline-secondary" href="${archivoUrl(p.imagenUrl)}" target="_blank">Ver foto</a>` : ''}
                <button class="btn btn-sm btn-outline-primary" onclick="editarPrueba(${p.id})">Editar</button>
                <button class="btn btn-sm btn-outline-danger" onclick="eliminarPrueba(${p.id})">Eliminar</button>
            </div>
        </div>`).join('');
}

function editarPrueba(id) {
    const cont = document.getElementById('listado-pruebas-admin');
    const p = JSON.parse(cont.dataset.lista || '[]').find(x => x.id === id);
    if (!p) return;
    document.getElementById('prueba-id').value = p.id;
    document.getElementById('prueba-descripcion').value = p.descripcion || '';
    document.getElementById('prueba-grupo').value = p.grupo || '';
    document.getElementById('prueba-usuario').value = p.usuarioEmail || obtenerAdminEmail();
    document.getElementById('prueba-jwt').value = p.jwtToken || '';
    cancelarEdicionBotones('prueba');
}

async function eliminarPrueba(id) {
    if (!confirm('¿Seguro que deseas eliminar esta prueba?')) return;
    const resp = await api('/api/Prueba/' + id, 'DELETE');
    if (resp.ok) { mostrarAlerta('alerta-panel', 'Prueba eliminada.', 'success'); cargarPruebasAdmin(); }
    else mostrarAlerta('alerta-panel', 'Error al eliminar.', 'danger');
}

document.getElementById('form-prueba').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('prueba-id').value;
    const descripcion = document.getElementById('prueba-descripcion').value.trim();
    const usuario = document.getElementById('prueba-usuario').value.trim() || obtenerAdminEmail();
    const jwt = document.getElementById('prueba-jwt').value.trim();
    let grupo = document.getElementById('prueba-grupo').value.trim();
    const archivos = Array.from(document.getElementById('prueba-imagen').files);

    if (id) {
        const formData = new FormData();
        formData.append('Descripcion', descripcion);
        formData.append('Grupo', grupo);
        formData.append('UsuarioEmail', usuario);
        formData.append('JwtToken', jwt);
        if (archivos.length) formData.append('Imagen', archivos[0]);
        const resp = await api('/api/Prueba/' + id, 'PUT', formData, true);
        if (resp.ok) {
            mostrarAlerta('alerta-panel', 'Prueba actualizada correctamente.', 'success');
            document.getElementById('form-prueba').reset();
            document.getElementById('prueba-id').value = '';
            cargarPruebasAdmin();
        } else {
            mostrarAlerta('alerta-panel', 'Error al actualizar la prueba.', 'danger');
        }
        return;
    }

    if (!grupo && archivos.length > 1) {
        grupo = 'grupo-' + Date.now();
    }

    const subir = async (archivo) => {
        const fd = new FormData();
        fd.append('Descripcion', descripcion);
        fd.append('Grupo', grupo);
        fd.append('UsuarioEmail', usuario);
        fd.append('JwtToken', jwt);
        fd.append('Imagen', archivo);
        return api('/api/Prueba', 'POST', fd, true);
    };

    let correctas = 0;
    let errores = 0;
    for (const archivo of archivos.length ? archivos : [null]) {
        const resp = await subir(archivo);
        if (resp.ok) correctas++; else errores++;
    }

    if (correctas > 0 || errores === 0) {
        mostrarAlerta('alerta-panel', correctas + ' prueba(s) guardada(s) correctamente.', 'success');
        document.getElementById('form-prueba').reset();
        document.getElementById('prueba-id').value = '';
        cargarPruebasAdmin();
    } else {
        mostrarAlerta('alerta-panel', 'Error al guardar la prueba.', 'danger');
    }
});

// ---------- UTILIDADES ----------
function cancelarEdicion(seccion) {
    document.getElementById(seccion + '-id').value = '';
    document.getElementById('form-' + seccion).reset();
    const btnGuarda = document.getElementById('btn-' + seccion + '-guardar');
    if (btnGuarda) btnGuarda.textContent = 'Guardar';
    guardarBotonesCancelar(seccion);
}

function guardarBotonesCancelar(seccion) {
    const form = document.getElementById('form-' + seccion);
    const btn = form.querySelector('button[type="submit"]');
    if (btn) btn.textContent = (btn.textContent === 'Actualizar') ? 'Guardar' : btn.textContent;
    const cancel = form.querySelector('button[onclick*="cancelarEdicion"]');
    if (cancel && !cancel.classList.contains('d-none')) cancel.classList.add('d-none');
}

function cancelarEdicionBotones(seccion) {
    const form = document.getElementById('form-' + seccion);
    const btn = form.querySelector('button[type="submit"]');
    if (btn) btn.textContent = 'Actualizar';
    const cancel = form.querySelector('button[onclick*="cancelarEdicion"]');
    if (cancel) cancel.classList.remove('d-none');
}