const ordenDias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

const ramosPorDefecto = [
  { ramo: "Iniciativa y Gestión Personal y Social", dia: "Lunes", hora: "18:40 - 20:50", sala: "S-02-P2-B" },
  { ramo: "Taller de Habilidades TIC", dia: "Martes", hora: "18:40 - 20:00", sala: "PA" },
  { ramo: "Taller de Habilidades Comunicativas", dia: "Martes", hora: "20:10 - 21:30", sala: "PA" },
  { ramo: "Nivelación Matemática", dia: "Miércoles", hora: "18:40 - 21:30", sala: "S-05-P4-A" },
  { ramo: "Estructuras de Datos y Algoritmos", dia: "Jueves", hora: "18:40 - 22:20", sala: "L-03-P3-A" },
  { ramo: "Hardware y Conectividad de Equipos Personales", dia: "Viernes", hora: "18:40 - 22:20", sala: "L-01-P03-A" },
  { ramo: "Estructuras de Datos y Algoritmos", dia: "Sábado", hora: "08:15 - 09:35", sala: "S-06-P3-A" },
  { ramo: "Especificación de Requerimientos", dia: "Sábado", hora: "09:45 - 12:35", sala: "S-06-P3-A" }
];

let ramos = JSON.parse(localStorage.getItem('ramos')) || ramosPorDefecto;
let editandoIndex = null;

const cuerpo = document.getElementById('cuerpo-horario');
const inputDia = document.getElementById('input-dia');
const inputHora = document.getElementById('input-hora');
const inputRamo = document.getElementById('input-ramo');
const inputSala = document.getElementById('input-sala');
const btnAgregar = document.getElementById('btn-agregar-ramo');

function guardarRamos() {
  localStorage.setItem('ramos', JSON.stringify(ramos));
}

function renderizar() {
  const ordenados = ramos
    .map((r, i) => ({ ...r, indexOriginal: i }))
    .sort((a, b) => ordenDias.indexOf(a.dia) - ordenDias.indexOf(b.dia));

  cuerpo.innerHTML = '';

  ordenados.forEach((r) => {
    if (editandoIndex === r.indexOriginal) {
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
            <button onclick="guardarEdicion(${r.indexOriginal})">Guardar</button>
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
            <button onclick="editarRamo(${r.indexOriginal})">Editar</button>
            <button onclick="eliminarRamo(${r.indexOriginal})">Eliminar</button>
          </td>
        </tr>
      `;
    }
  });
}

function editarRamo(index) {
  editandoIndex = index;
  renderizar();
}

function cancelarEdicion() {
  editandoIndex = null;
  renderizar();
}

function guardarEdicion(index) {
  const nuevoDia = document.getElementById('edit-dia').value;
  const nuevaHora = document.getElementById('edit-hora').value;
  const nuevoRamo = document.getElementById('edit-ramo').value;
  const nuevaSala = document.getElementById('edit-sala').value;

  if (!nuevaHora || !nuevoRamo) {
    alert('Por favor completa la hora y el nombre del ramo.');
    return;
  }

  ramos[index] = { dia: nuevoDia, hora: nuevaHora, ramo: nuevoRamo, sala: nuevaSala };
  editandoIndex = null;
  guardarRamos();
  renderizar();
}

function eliminarRamo(index) {
  ramos.splice(index, 1);
  guardarRamos();
  renderizar();
}

btnAgregar.addEventListener('click', () => {
  if (!inputHora.value || !inputRamo.value) {
    alert('Por favor completa la hora y el nombre del ramo.');
    return;
  }
  ramos.push({
    dia: inputDia.value,
    hora: inputHora.value,
    ramo: inputRamo.value,
    sala: inputSala.value
  });
  guardarRamos();
  renderizar();
  inputHora.value = '';
  inputRamo.value = '';
  inputSala.value = '';
});

renderizar();
