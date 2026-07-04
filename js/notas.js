let notas = JSON.parse(localStorage.getItem('notas')) || [];

const listaDiv = document.getElementById('lista-notas');
const resultadoSpan = document.getElementById('resultado');
const sumaPorcentajesSpan = document.getElementById('suma-porcentajes');
const btnAgregar = document.getElementById('btn-agregar');

function renderizar() {
  listaDiv.innerHTML = '';
  notas.forEach((nota, index) => {
    listaDiv.innerHTML += `
      <div>
        Nota: <input type="number" min="1" max="7" step="0.1" value="${nota.valor}" 
               onchange="actualizarNota(${index}, 'valor', this.value)">
        Porcentaje: <input type="number" min="0" max="100" step="1" value="${nota.porcentaje}" 
               onchange="actualizarNota(${index}, 'porcentaje', this.value)">%
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
    return;
  }

  const sumaPorcentajes = notas.reduce((acc, n) => acc + parseFloat(n.porcentaje || 0), 0);
  sumaPorcentajesSpan.textContent = sumaPorcentajes.toFixed(0);

  if (sumaPorcentajes === 0) {
    resultadoSpan.textContent = '0';
    return;
  }

  const sumaPonderada = notas.reduce((acc, n) => {
    return acc + (parseFloat(n.valor) * parseFloat(n.porcentaje || 0));
  }, 0);

  const promedio = sumaPonderada / sumaPorcentajes;
  resultadoSpan.textContent = promedio.toFixed(2);
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

renderizar();