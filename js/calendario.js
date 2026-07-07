let eventos = [];
let editandoIndex = null;
let rutaUsuario = null;

const cuerpo = document.getElementById('cuerpo-eventos');
const inputFecha = document.getElementById('input-fecha');
const inputEvento = document.getElementById('input-evento');
const inputTipo = document.getElementById('input-tipo');
const btnAgregar = document.getElementById('btn-agregar-evento');

auth.onAuthStateChanged((user) => {
  if (user) {
    rutaUsuario = db.ref('usuarios/' + user.uid + '/eventos');
    rutaUsuario.on('value', (snapshot) => {
      const datos = snapshot.val();
      eventos = datos ? Object.keys(datos).map(key => ({ id: key, ...datos[key] })) : [];
      renderizar();
    });
  }
});

function renderizar() {
  const ordenados = [...eventos].sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
  cuerpo.innerHTML = '';

  ordenados.forEach((e) => {
    if (editandoIndex === e.id) {
      cuerpo.innerHTML += `
        <tr>
          <td><input type="date" id="edit-fecha" value="${e.fecha}"></td>
          <td><input type="text" id="edit-evento" value="${e.evento}" onfocus="this.select()"></td>
          <td>
            <select id="edit-tipo">
              <option value="prueba" ${e.tipo === 'prueba' ? 'selected' : ''}>Prueba</option>
              <option value="entrega" ${e.tipo === 'entrega' ? 'selected' : ''}>Entrega</option>
              <option value="vacaciones" ${e.tipo === 'vacaciones' ? 'selected' : ''}>Vacaciones</option>
            </select>
          </td>
          <td>
            <button onclick="guardarEdicion('${e.id}')">Guardar</button>
            <button onclick="cancelarEdicion()">Cancelar</button>
          </td>
        </tr>
      `;
    } else {
      cuerpo.innerHTML += `
        <tr>
          <td>${e.fecha}</td>
          <td>${e.evento}</td>
          <td>${e.tipo}</td>
          <td>
            <button onclick="editarEvento('${e.id}')">Editar</button>
            <button onclick="eliminarEvento('${e.id}')">Eliminar</button>
          </td>
        </tr>
      `;
    }
  });
}

function editarEvento(id) {
  editandoIndex = id;
  renderizar();
}

function cancelarEdicion() {
  editandoIndex = null;
  renderizar();
}

function guardarEdicion(id) {
  const nuevaFecha = document.getElementById('edit-fecha').value;
  const nuevoEvento = document.getElementById('edit-evento').value;
  const nuevoTipo = document.getElementById('edit-tipo').value;

  if (!nuevaFecha || !nuevoEvento) {
    alert('Por favor completa la fecha y el nombre del evento.');
    return;
  }

  rutaUsuario.child(id).set({ fecha: nuevaFecha, evento: nuevoEvento, tipo: nuevoTipo });
  editandoIndex = null;
}

function eliminarEvento(id) {
  rutaUsuario.child(id).remove();
}

btnAgregar.addEventListener('click', () => {
  if (!inputFecha.value || !inputEvento.value) {
    alert('Por favor completa la fecha y el nombre del evento.');
    return;
  }
  rutaUsuario.push({
    fecha: inputFecha.value,
    evento: inputEvento.value,
    tipo: inputTipo.value
  });
  inputFecha.value = '';
  inputEvento.value = '';
});
