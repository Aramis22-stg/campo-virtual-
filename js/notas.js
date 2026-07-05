let notas = JSON.parse(localStorage.getItem('notas')) || [];

const listaDiv = document.getElementById('lista-notas');
const resultadoSpan = document.getElementById('resultado');
const sumaPorcentajesSpan = document.getElementById('suma-porcentajes');
const btnAgregar = document.getElementById('btn-agregar');
const inputNotaMinima = document.getElementById('input-nota-minima');
const inputPorcentajeFaltante = document.getElementById('input-porcentaje-faltante');
const resultadoNecesario = document.getElementById('resultado-necesario');

function renderizar() {
  listaDiv.innerHTML = '';
  notas.forEach((nota, index) => {
    listaDiv.innerHTML += `
      <div>
Nota: <input type="number" min="1" max="7" step="0.1" value="${nota.valor}" 
       onchange="actualizarNota(${index}, 'valor', this.value)"
       onfocus="this.select()">
Porcentaje: <input type="number" min="0" max="100" step="1" value="${nota.porcentaje}" 
       onchange="actualizarNota(${index}, 'porcentaje', this.value)"
       onfocus="this.select()">%
        <button onclick="eliminarNota(${index})">Eliminar</button>
      </div>
    `;
  });
  calcularPromedio();
}

function calcularPromedio() {
  if (notas.length === 0) {
    resultadoSpan.textContent = '0';
    sumaPorcentajesSpan.textContent = '0';
    calcularNotaNecesaria(0, 0);
    return;
  }

  const sumaPorcentajes = notas.reduce((acc, n) => acc + parseFloat(n.porcentaje || 0), 0);
  sumaPorcentajesSpan.textContent = sumaPorcentajes.toFixed(0);

  const sumaPonderada = notas.reduce((acc, n) => {
    return acc + (parseFloat(n.valor) * parseFloat(n.porcentaje || 0));
  }, 0);

  if (sumaPorcentajes === 0) {
    resultadoSpan.textContent = '0';
    calcularNotaNecesaria(0, 0);
    return;
  }

  const promedio = sumaPonderada / sumaPorcentajes;
  resultadoSpan.textContent = promedio.toFixed(2);

  calcularNotaNecesaria(sumaPonderada, sumaPorcentajes);
}

function calcularNotaNecesaria(sumaPonderada, sumaPorcentajesActual) {
  const notaMinima = parseFloat(inputNotaMinima.value) || 4.0;
  const porcentajeFaltante = parseFloat(inputPorcentajeFaltante.value) || 0;

  if (porcentajeFaltante <= 0) {
    resultadoNecesario.textContent = 'Ingresa el porcentaje de la evaluación que falta.';
    return;
  }

  const porcentajeTotal = sumaPorcentajesActual + porcentajeFaltante;

  if (porcentajeTotal < 100) {
    resultadoNecesario.textContent = `Ojo: tus porcentajes actuales (${sumaPorcentajesActual}%) + la evaluación que falta (${porcentajeFaltante}%) no suman 100%. Revisa los datos.`;
    return;
  }

  // (sumaPonderada + notaNecesaria * porcentajeFaltante) / 100 = notaMinima
  const notaNecesaria = (notaMinima * 100 - sumaPonderada) / porcentajeFaltante;

  if (notaNecesaria > 7) {
    resultadoNecesario.textContent = `Necesitarías un ${notaNecesaria.toFixed(2)}, lo cual no es posible (máximo es 7.0). Lamentablemente ya no podrías aprobar con esta evaluación.`;
  } else if (notaNecesaria <= 1) {
    resultadoNecesario.textContent = `¡Ya aprobaste! Con cualquier nota en la evaluación restante mantienes el promedio mínimo.`;
  } else {
    resultadoNecesario.textContent = `Necesitas un ${notaNecesaria.toFixed(2)} en tu próxima evaluación para aprobar con un ${notaMinima}.`;
  }
}

function actualizarNota(index, campo, valor) {
  notas[index][campo] = valor;
  calcularPromedio();
  guardarNotas();
}

function eliminarNota(index) {
  notas.splice(index, 1);
  renderizar();
  guardarNotas();
}

function guardarNotas() {
  localStorage.setItem('notas', JSON.stringify(notas));
}

btnAgregar.addEventListener('click', () => {
  notas.push({ valor: 4.0, porcentaje: 0 });
  renderizar();
  guardarNotas();
});

inputNotaMinima.addEventListener('input', calcularPromedio);
inputPorcentajeFaltante.addEventListener('input', calcularPromedio);

renderizar();
