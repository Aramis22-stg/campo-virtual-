const diasSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

auth.onAuthStateChanged((user) => {
  if (!user) return;

  const hoy = new Date();
  const nombreDiaHoy = diasSemana[hoy.getDay()];
  const fechaHoyStr = hoy.toISOString().split('T')[0];

  const refRamos = db.ref('usuarios/' + user.uid + '/ramos');
  const refEventos = db.ref('usuarios/' + user.uid + '/eventos');

  Promise.all([refRamos.once('value'), refEventos.once('value')]).then(([snapRamos, snapEventos]) => {
    const datosRamos = snapRamos.val();
    const ramos = datosRamos ? Object.values(datosRamos) : [];
    const clasesHoy = ramos.filter(r => r.dia === nombreDiaHoy);

    const datosEventos = snapEventos.val();
    const eventos = datosEventos ? Object.values(datosEventos) : [];
    const eventosHoy = eventos.filter(e => e.fecha === fechaHoyStr);

    let html = `<h2 style="margin-bottom: 10px;">📌 Hoy es ${nombreDiaHoy}</h2>`;

    if (clasesHoy.length === 0 && eventosHoy.length === 0) {
      html += `<p class="vista-hoy-vacio">No tienes clases ni eventos registrados para hoy. 🎉</p>`;
    } else {
      if (clasesHoy.length > 0) {
        html += `<p class="vista-hoy-subtitulo">Tus clases de hoy:</p><ul class="vista-hoy-lista">`;
        clasesHoy.forEach(c => {
          html += `<li>🕒 ${c.hora} — <strong>${c.ramo}</strong> (${c.sala})</li>`;
        });
        html += `</ul>`;
      }
      if (eventosHoy.length > 0) {
        html += `<p class="vista-hoy-subtitulo">Eventos de hoy:</p><ul class="vista-hoy-lista">`;
        eventosHoy.forEach(e => {
          html += `<li>⚠️ ${e.evento} (${e.tipo})</li>`;
        });
        html += `</ul>`;
      }
    }

    document.getElementById('vista-hoy').innerHTML = html;
  });
});