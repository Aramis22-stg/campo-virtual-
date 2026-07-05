const eventosPorDefecto = [
  { fecha: "2026-06-24", evento: "Prueba de Nivelación Matemática", tipo: "prueba" },
  { fecha: "2026-06-24", evento: "Pruebas recuperativas", tipo: "prueba" },
  { fecha: "2026-06-25", evento: "Disertación Taller de Habilidades TIC", tipo: "prueba" },
  { fecha: "2026-06-25", evento: "Pruebas recuperativas", tipo: "prueba" },
  { fecha: "2026-06-26", evento: "Pruebas recuperativas", tipo: "prueba" },
  { fecha: "2026-06-27", evento: "Pruebas recuperativas", tipo: "prueba" },
  { fecha: "2026-06-29", evento: "Pruebas recuperativas", tipo: "prueba" },
  { fecha: "2026-07-01", evento: "Pruebas recuperativas", tipo: "prueba" },
  { fecha: "2026-07-02", evento: "Pruebas recuperativas", tipo: "prueba" },
  { fecha: "2026-07-03", evento: "Pruebas recuperativas", tipo: "prueba" },
  { fecha: "2026-07-06", evento: "Examen Final", tipo: "prueba" },
  { fecha: "2026-07-07", evento: "Examen Final", tipo: "prueba" },
  { fecha: "2026-07-08", evento: "Examen Final", tipo: "prueba" },
  { fecha: "2026-07-09", evento: "Examen Final", tipo: "prueba" },
  { fecha: "2026-07-10", evento: "Examen Final - Cierre del semestre", tipo: "prueba" },
  { fecha: "2026-08-10", evento: "Regreso a clases", tipo: "vacaciones" }
];

let eventos = JSON.parse(localStorage.getItem('eventos')) || eventosPorDefecto;
let editandoIndex = null;

const cuerpo = document.getElementById('cuerpo-eventos');
const inputFecha = document.getElementById('input-fecha');
const inputEvento = document.getElementById('input-evento');
const inputTipo = document.getElementById('input-tipo');
const btnAgregar = document.getElementById('btn-agregar-evento');

function guardarEventos() {
  localStorage.setItem('eventos', JSON.stringify(eventos));
}

function renderizar() {
  const ordenados = eventos
    .map((e, i) => ({ ...e, indexOriginal: i }))
    .sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

  cuerpo.innerHTML = '';

  ordenados.forEach((e) => {
    if (editandoIndex === e.indexOriginal) {
      // Fila en modo edición
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
            <button onclick="guardarEdicion(${e.indexOriginal})">Guardar</button>
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
            <button onclick="editarEvento(${e.indexOriginal})">Editar</button>
            <button onclick="eliminarEvento(${e.indexOriginal})">Eliminar</button>
          </td>
        </tr>
      `;
    }
  });
}

function editarEvento(index) {
  editandoIndex = index;
  renderizar();
}

function cancelarEdicion() {
  editandoIndex = null;
  renderizar();
}

function guardarEdicion(index) {
  const nuevaFecha = document.getElementById('edit-fecha').value;
  const nuevoEvento = document.getElementById('edit-evento').value;
  const nuevoTipo = document.getElementById('edit-tipo').value;

  if (!nuevaFecha || !nuevoEvento) {
    alert('Por favor completa la fecha y el nombre del evento.');
    return;
  }

  eventos[index] = { fecha: nuevaFecha, evento: nuevoEvento, tipo: nuevoTipo };
  editandoIndex = null;
  guardarEventos();
  renderizar();
}

function eliminarEvento(index) {
  eventos.splice(index, 1);
  guardarEventos();
  renderizar();
}

btnAgregar.addEventListener('click', () => {
  if (!inputFecha.value || !inputEvento.value) {
    alert('Por favor completa la fecha y el nombre del evento.');
    return;
  }
  eventos.push({
    fecha: inputFecha.value,
    evento: inputEvento.value,
    tipo: inputTipo.value
  });
  guardarEventos();
  renderizar();
  inputFecha.value = '';
  inputEvento.value = '';
});

renderizar();
