document.addEventListener('DOMContentLoaded', () => {

    document.getElementById('cargarParaEditar')
        .addEventListener('click', async () => {
            try {
                const res = await fetch('/api/Usu');
                const usuarios = await res.json();
                if (usuarios.length === 0) {
                    alert('No hay usuarios para editar.');
                    return;
                }
                const u = usuarios[0];
                document.getElementById('nomb').value = u.nombre || '';
                document.getElementById('apellido').value = u.apellido || '';
                document.getElementById('titu').value = u.tituloProfesional || '';
                document.getElementById('acerca').value = u.acercaDe || '';
                document.getElementById('email').value = u.email || '';
                document.getElementById('telef').value = u.telefono || '';
                document.getElementById('link').value = u.linkedinUrl || '';
                document.getElementById('gith').value = u.githubUrl || '';
                alert('Datos cargados en el formulario. Modifica y presiona "Actualizar Todo".');
            } catch (err) {
                console.error('Error al cargar datos:', err);
                alert('No se pudieron cargar los datos.');
            }
        });

    document.getElementById('btnActualizarTodo')
        .addEventListener('click', async () => {
            try {
                const res = await fetch('/api/Usu');
                const usuarios = await res.json();
                if (usuarios.length === 0) {
                    alert('No hay usuarios para actualizar.');
                    return;
                }
                const id = usuarios[0].id_Usuario;
                const datos = {
                    Nombre: document.getElementById('nomb').value,
                    Apellido: document.getElementById('apellido').value,
                    TituloProfesional: document.getElementById('titu').value,
                    AcercaDe: document.getElementById('acerca').value,
                    Email: document.getElementById('email').value,
                    Telefono: document.getElementById('telef').value,
                    LinkedinUrl: document.getElementById('link').value,
                    GithubUrl: document.getElementById('gith').value
                };
                const putRes = await fetch('/api/Usu/' + id, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(datos)
                });
                if (putRes.ok) {
                    alert('Usuario actualizado correctamente.');
                } else {
                    const errText = await putRes.text();
                    alert('Error del servidor: ' + putRes.status + ' - ' + errText);
                }
            } catch (err) {
                console.error('Error al actualizar:', err);
                alert('No se pudo conectar con la API.');
            }
        });

});
