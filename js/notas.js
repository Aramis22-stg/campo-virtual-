let notas = [];
let rutaUsuario = null;

const contenedor = document.getElementById('contenedor-asignaturas');
const btnAgregar = document.getElementById('btn-agregar');
const inputAsignatura = document.getElementById('input-asignatura');
const inputValor = document.getElementById('input-valor');
const inputPorcentaje = document.getElementById('input-porcentaje');
const listaAsignaturas = document.getElementById('lista-asignaturas');
const selectAsignaturaNecesaria = document.getElementById('select-asignatura-necesaria');
const inputNotaMinima = document.getElementById('input-nota-minima');
const inputPorcentajeFaltante = document.getElementById('input-porcentaje-faltante');
const resultadoNecesario = document.getElementById('resultado-necesario');

auth.onAuthStateChanged((user) => {
  if (user) {
    rutaUsuario = db.ref('usuarios/' + user.uid + '/notas');
    rutaUsuario.on('value', (snapshot) => {
      const datos = snapshot.val();
      notas = datos ? Object.keys(datos).map(key => ({ id: key, ...datos[key] })) : [];
      renderizar();
    });
  }
});

function agruparPorAsignatura() {
  const grupos = {};
  notas.forEach(n => {
    if (!grupos[n.asignatura]) grupos[n.asignatura] = [];
    grupos[n.asignatura].push(n);
  });
  return grupos;
}

function renderizar() {
  const grupos = agruparPorAsignatura();
  const nombresAsignaturas = Object.keys(grupos).sort();

  // Sugerencias del datalist
  listaAsignaturas.innerHTML = nombresAsignaturas.map(a => `<option value="${a}">`).join('');

  // Selector de "nota necesaria"
  const seleccionActual = selectAsignaturaNecesaria.value;
  selectAsignaturaNecesaria.innerHTML = nombresAsignaturas.map(a => `<option value="${a}">${a}</option>`).join('');
  if (nombresAsignaturas.includes(seleccionActual)) {
    selectAsignaturaNecesaria.value = seleccionActual;
  }

  // Tarjetas por asignatura
  contenedor.innerHTML = '';
  if (nombresAsignaturas.length === 0) {
    contenedor.innerHTML = '<p style="padding: 0 20px;">Aún no has agregado notas. Escribe una asignatura arriba para comenzar.</p>';
  }

  nombresAsignaturas.forEach(asig => {
    const notasAsig = grupos[asig];
    const sumaPorcentajes = notasAsig.reduce((acc, n) => acc + parseFloat(n.porcentaje || 0), 0);
    const sumaPonderada = notasAsig.reduce((acc, n) => acc + (parseFloat(n.valor) * parseFloat(n.porcentaje || 0)), 0);
    const promedio = sumaPorcentajes > 0 ? (sumaPonderada / sumaPorcentajes).toFixed(2) : '0';

    let filas = '';
    notasAsig.forEach(n => {
      filas += `
        <div style="margin-bottom: 6px;">
          Nota: <input type="number" min="1" max="7" step="0.1" value="${n.valor}"
                 onchange="actualizarNota('${n.id}', 'valor', this.value)" onfocus="this.select()" style="width: 60px;">
          Porcentaje: <input type="number" min="0" max="100" step="1" value="${n.porcentaje}"
                 onchange="actualizarNota('${n.id}', 'porcentaje', this.value)" onfocus="this.select()" style="width: 60px;">%
          <button onclick="eliminarNota('${n.id}')">Eliminar</button>
        </div>
      `;
    });

    contenedor.innerHTML += `
      <div style="border: 1px solid #ccc; border-radius: 6px; padding: 15px; margin: 0 20px 20px 20px; background: white;">
        <h2 style="margin-top: 0;">${asig}</h2>
        ${filas}
        <p><strong>Suma de porcentajes:</strong> ${sumaPorcentajes.toFixed(0)}% &nbsp; | &nbsp; <strong>Promedio:</strong> ${promedio}</p>
      </div>
    `;
  });

  calcularNotaNecesaria();
}

function actualizarNota(id, campo, valor) {
  rutaUsuario.child(id).update({ [campo]: valor });
}

function eliminarNota(id) {
  rutaUsuario.child(id).remove();
}

btnAgregar.addEventListener('click', () => {
  const asignatura = inputAsignatura.value.trim();
  const valor = inputValor.value;
  const porcentaje = inputPorcentaje.value;

  if (!asignatura || !valor || porcentaje === '') {
    alert('Por favor completa asignatura, nota y porcentaje.');
    return;
  }

  rutaUsuario.push({ asignatura, valor: parseFloat(valor), porcentaje: parseFloat(porcentaje) });
  inputValor.value = '';
  inputPorcentaje.value = '';
});

function calcularNotaNecesaria() {
  const asignaturaElegida = selectAsignaturaNecesaria.value;
  const notasAsig = notas.filter(n => n.asignatura === asignaturaElegida);

  if (!asignaturaElegida || notasAsig.length === 0) {
    resultadoNecesario.textContent = 'Agrega al menos una nota para calcular.';
    return;
  }

  const sumaPorcentajesActual = notasAsig.reduce((acc, n) => acc + parseFloat(n.porcentaje || 0), 0);
  const sumaPonderada = notasAsig.reduce((acc, n) => acc + (parseFloat(n.valor) * parseFloat(n.porcentaje || 0)), 0);

  const notaMinima = parseFloat(inputNotaMinima.value) || 4.0;
  const porcentajeFaltante = parseFloat(inputPorcentajeFaltante.value) || 0;

  if (porcentajeFaltante <= 0) {
    resultadoNecesario.textContent = `Ingresa el porcentaje de la evaluación que falta en "${asignaturaElegida}".`;
    return;
  }

  const porcentajeTotal = sumaPorcentajesActual + porcentajeFaltante;

  if (porcentajeTotal < 100) {
    resultadoNecesario.textContent = `Ojo: en "${asignaturaElegida}" tus porcentajes actuales (${sumaPorcentajesActual}%) + la evaluación que falta (${porcentajeFaltante}%) no suman 100%. Revisa los datos.`;
    return;
  }

  const notaNecesaria = (notaMinima * 100 - sumaPonderada) / porcentajeFaltante;

  if (notaNecesaria > 7) {
    resultadoNecesario.textContent = `En "${asignaturaElegida}" necesitarías un ${notaNecesaria.toFixed(2)}, lo cual no es posible (máximo 7.0).`;
  } else if (notaNecesaria <= 1) {
    resultadoNecesario.textContent = `¡Ya aprobaste "${asignaturaElegida}"! Cualquier nota en la evaluación restante mantiene el promedio mínimo.`;
  } else {
    resultadoNecesario.textContent = `En "${asignaturaElegida}" necesitas un ${notaNecesaria.toFixed(2)} en tu próxima evaluación para aprobar con un ${notaMinima}.`;
  }
}

selectAsignaturaNecesaria.addEventListener('change', calcularNotaNecesaria);
inputNotaMinima.addEventListener('input', calcularNotaNecesaria);
inputPorcentajeFaltante.addEventListener('input', calcularNotaNecesaria);
