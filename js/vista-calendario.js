const nombresMeses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
const nombresDiasCortos = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

let mesActual = new Date().getMonth();
let anioActual = new Date().getFullYear();
let eventosParaCalendario = [];

function renderizarVistaMensual() {
  const contenedor = document.getElementById('vista-mensual');
  if (!contenedor) return;

  const primerDiaDelMes = new Date(anioActual, mesActual, 1);
  const diasEnElMes = new Date(anioActual, mesActual + 1, 0).getDate();
  const diaSemanaInicio = primerDiaDelMes.getDay();

  const hoyStr = new Date().toISOString().split('T')[0];

  let html = `
    <div class="calendario-cabecera">
      <button type="button" onclick="cambiarMes(-1)">◀</button>
      <h2 style="margin:0;">${nombresMeses[mesActual]} ${anioActual}</h2>
      <button type="button" onclick="cambiarMes(1)">▶</button>
    </div>
    <div class="calendario-grid">
  `;

  nombresDiasCortos.forEach(d => {
    html += `<div class="calendario-dia-nombre">${d}</div>`;
  });

  for (let i = 0; i < diaSemanaInicio; i++) {
    html += `<div class="calendario-celda vacia"></div>`;
  }

  for (let dia = 1; dia <= diasEnElMes; dia++) {
    const fechaCelda = `${anioActual}-${String(mesActual + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
    const eventosDelDia = eventosParaCalendario.filter(e => e.fecha === fechaCelda);
    const esHoy = fechaCelda === hoyStr;

    html += `<div class="calendario-celda ${esHoy ? 'hoy' : ''}">
      <div class="calendario-numero">${dia}</div>`;

    eventosDelDia.forEach(e => {
      html += `<div class="calendario-punto tipo-${e.tipo}" title="${e.evento}">${e.evento}</div>`;
    });

    html += `</div>`;
  }

  html += `</div>`;
  contenedor.innerHTML = html;
}

function cambiarMes(direccion) {
  mesActual += direccion;
  if (mesActual > 11) { mesActual = 0; anioActual++; }
  if (mesActual < 0) { mesActual = 11; anioActual--; }
  renderizarVistaMensual();
}