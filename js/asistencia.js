let asistencias = [];
let editandoAsistenciaId = null;
let rutaAsistencia = null;

const cuerpoAsistencia = document.getElementById('cuerpo-asistencia');
const inputAsigAsistencia = document.getElementById('input-asig-asistencia');
const inputTotalClases = document.getElementById('input-total-clases');
const inputFaltas = document.getElementById('input-faltas');
const inputMinimo = document.getElementById('input-minimo-asistencia');
const btnAgregarAsistencia = document.getElementById('btn-agregar-asistencia');

auth.onAuthStateChanged((user) => {
  if (user) {
    rutaAsistencia = db.ref('usuarios/' + user.uid + '/asistencia');
    rutaAsistencia.on('value', (snapshot) => {
      const datos = snapshot.val();
      asistencias = datos ? Object.keys(datos).map(key => ({ id: key, ...datos[key] })) : [];
      renderizarAsistencia();
    });
  }
});

function renderizarAsistencia() {
  cuerpoAsistencia.innerHTML = '';

  if (asistencias.length === 0) {
    cuerpoAsistencia.innerHTML = '<p style="padding: 0 20px; color: #666;">Aún no has agregado ninguna asignatura para controlar tu asistencia.</p>';
    return;
  }

  asistencias.forEach((a) => {
    if (editandoAsistenciaId === a.id) {
      cuerpoAsistencia.innerHTML += `
        <div class="tarjeta-asistencia">
          Asignatura: <input type="text" id="edit-asig" value="${a.asignatura}" onfocus="this.select()"><br><br>
          Total de clases del semestre: <input type="number" id="edit-total" value="${a.totalClases}" style="width:70px"><br><br>
          Clases que ya pasaron: <input type="number" id="edit-pasadas" value="${a.clasesPasadas}" style="width:70px"><br><br>
          Faltas hasta ahora: <input type="number" id="edit-faltas" value="${a.faltas}" style="width:70px"><br><br>
          % mínimo requerido: <input type="number" id="edit-minimo" value="${a.minimo}" style="width:70px">%<br><br>
          <button onclick="guardarEdicionAsistencia('${a.id}')">Guardar</button>
          <button onclick="cancelarEdicionAsistencia()">Cancelar</button>
        </div>
      `;
    } else {
      const asistenciaActual = a.clasesPasadas > 0 ? ((a.clasesPasadas - a.faltas) / a.clasesPasadas * 100) : 100;
      const maximoFaltasPermitidas = Math.floor(a.totalClases * (1 - a.minimo / 100));
      const faltasRestantes = maximoFaltasPermitidas - a.faltas;

      let colorEstado = '#00563f';
      let mensajeEstado = `Puedes faltar ${faltasRestantes} clase(s) más y seguir cumpliendo el ${a.minimo}% mínimo.`;
      if (faltasRestantes < 0) {
        colorEstado = '#c0392b';
        mensajeEstado = `⚠️ Ya superaste el máximo de inasistencias permitidas para el ${a.minimo}% mínimo.`;
      } else if (faltasRestantes <= 1) {
        colorEstado = '#d35400';
        mensajeEstado = `⚠️ Estás muy cerca del límite: solo puedes faltar ${faltasRestantes} clase(s) más.`;
      }

      cuerpoAsistencia.innerHTML += `
        <div class="tarjeta-asistencia">
          <h3 style="margin-top:0;">${a.asignatura}</h3>
          <p>Asistencia actual: <strong>${asistenciaActual.toFixed(1)}%</strong> (${a.clasesPasadas - a.faltas} de ${a.clasesPasadas} clases)</p>
          <p style="color: ${colorEstado}; font-weight: bold;">${mensajeEstado}</p>
          <button onclick="editarAsistencia('${a.id}')">Editar</button>
          <button onclick="eliminarAsistencia('${a.id}')">Eliminar</button>
        </div>
      `;
    }
  });
}

function editarAsistencia(id) {
  editandoAsistenciaId = id;
  renderizarAsistencia();
}

function cancelarEdicionAsistencia() {
  editandoAsistenciaId = null;
  renderizarAsistencia();
}

function guardarEdicionAsistencia(id) {
  const asignatura = document.getElementById('edit-asig').value.trim();
  const totalClases = parseFloat(document.getElementById('edit-total').value);
  const clasesPasadas = parseFloat(document.getElementById('edit-pasadas').value);
  const faltas = parseFloat(document.getElementById('edit-faltas').value);
  const minimo = parseFloat(document.getElementById('edit-minimo').value);

  if (!asignatura || isNaN(totalClases) || isNaN(clasesPasadas) || isNaN(faltas) || isNaN(minimo)) {
    alert('Por favor completa todos los campos correctamente.');
    return;
  }

  rutaAsistencia.child(id).set({ asignatura, totalClases, clasesPasadas, faltas, minimo }).then(mostrarGuardado);
  editandoAsistenciaId = null;
}

function eliminarAsistencia(id) {
  rutaAsistencia.child(id).remove().then(mostrarGuardado);
}

btnAgregarAsistencia.addEventListener('click', () => {
  const asignatura = inputAsigAsistencia.value.trim();
  const totalClases = parseFloat(inputTotalClases.value);
  const faltas = parseFloat(inputFaltas.value) || 0;
  const minimo = parseFloat(inputMinimo.value) || 75;

  if (!asignatura || !totalClases) {
    alert('Por favor completa al menos la asignatura y el total de clases del semestre.');
    return;
  }

  rutaAsistencia.push({
    asignatura,
    totalClases,
    clasesPasadas: totalClases,
    faltas,
    minimo
  }).then(mostrarGuardado);

  inputAsigAsistencia.value = '';
  inputTotalClases.value = '';
  inputFaltas.value = '';
  inputMinimo.value = '';
});