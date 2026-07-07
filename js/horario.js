const ordenDias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

let ramos = [];
let editandoIndex = null;
let rutaUsuario = null;
let terminoBusqueda = '';

const cuerpo = document.getElementById('cuerpo-horario');
const inputDia = document.getElementById('input-dia');
const inputHora = document.getElementById('input-hora');
const inputRamo = document.getElementById('input-ramo');
const inputSala = document.getElementById('input-sala');
const btnAgregar = document.getElementById('btn-agregar-ramo');
const inputBuscar = document.getElementById('input-buscar');
const sinResultados = document.getElementById('sin-resultados');

auth.onAuthStateChanged((user) => {
  if (user) {
    rutaUsuario = db.ref('usuarios/' + user.uid + '/ramos');
    rutaUsuario.on('value', (snapshot) => {
      const datos = snapshot.val();
      ramos = datos ? Object.keys(datos).map(key => ({ id: key, ...datos[key] })) : [];
      renderizar();
    });
  }
});

inputBuscar.addEventListener('input', () => {
  terminoBusqueda = inputBuscar.value;
  renderizar();
});

function renderizar() {
  let filtrados = ramos;

  if (terminoBusqueda.trim() !== '') {
    const termino = terminoBusqueda.toLowerCase();
    filtrados = ramos.filter(r =>
      r.ramo.toLowerCase().includes(termino) ||
      r.dia.toLowerCase().includes(termino) ||
      r.sala.toLowerCase().includes(termino) ||
      r.hora.toLowerCase().includes(termino)
    );
  }

  const ordenados = [...filtrados].sort((a, b) => ordenDias.indexOf(a.dia) - ordenDias.indexOf(b.dia));

  cuerpo.innerHTML = '';
  sinResultados.style.display = ordenados.length === 0 ? 'block' : 'none';

  ordenados.forEach((r) => {
    if (editandoIndex === r.id) {
      cuerpo.innerHTML += `
        <tr>
          <td>
            <select id="edit-dia">
              ${ordenDias.map(d => `<option value="${d}" ${r.dia === d ? 'selected' : ''}>${d}</option>`).join('')}
            </select>
          </td>
          <td><input type="text" id="edit-hora" value="${r.hora}" onfocus="this.select()"></td>
          <td><input type="text" id="edit-ramo" value="${r.ramo}" onfocus="this.select()"></td>
          <td><input type="text" id="edit-sala" value="${r.sala}" onfocus="this.select()"></td>
          <td>
            <button onclick="guardarEdicion('${r.id}')">Guardar</button>
            <button onclick="cancelarEdicion()">Cancelar</button>
          </td>
        </tr>
      `;
    } else {
      cuerpo.innerHTML += `
        <tr>
          <td>${r.dia}</td>
          <td>${r.hora}</td>
          <td>${r.ramo}</td>
          <td>${r.sala}</td>
          <td>
            <button onclick="editarRamo('${r.id}')">Editar</button>
            <button onclick="eliminarRamo('${r.id}')">Eliminar</button>
          </td>
        </tr>
      `;
    }
  });
}

function editarRamo(id) {
  editandoIndex = id;
  renderizar();
}

function cancelarEdicion() {
  editandoIndex = null;
  renderizar();
}

function guardarEdicion(id) {
  const nuevoDia = document.getElementById('edit-dia').value;
  const nuevaHora = document.getElementById('edit-hora').value;
  const nuevoRamo = document.getElementById('edit-ramo').value;
  const nuevaSala = document.getElementById('edit-sala').value;

  if (!nuevaHora || !nuevoRamo) {
    alert('Por favor completa la hora y el nombre del ramo.');
    return;
  }

  rutaUsuario.child(id).set({ dia: nuevoDia, hora: nuevaHora, ramo: nuevoRamo, sala: nuevaSala });
  editandoIndex = null;
}

function eliminarRamo(id) {
  rutaUsuario.child(id).remove();
}

btnAgregar.addEventListener('click', () => {
  if (!inputHora.value || !inputRamo.value) {
    alert('Por favor completa la hora y el nombre del ramo.');
    return;
  }
  rutaUsuario.push({
    dia: inputDia.value,
    hora: inputHora.value,
    ramo: inputRamo.value,
    sala: inputSala.value
  });
  inputHora.value = '';
  inputRamo.value = '';
  inputSala.value = '';
});
