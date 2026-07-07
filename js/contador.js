auth.onAuthStateChanged((user) => {
  if (!user) return;

  const refEventos = db.ref('usuarios/' + user.uid + '/eventos');
  refEventos.once('value').then((snapshot) => {
    const datos = snapshot.val();
    const eventos = datos ? Object.values(datos) : [];
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const futuros = eventos
      .filter(e => new Date(e.fecha + 'T00:00:00') >= hoy)
      .sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

    if (futuros.length === 0) {
      document.getElementById('contador-regresivo').style.display = 'none';
      return;
    }

    // Prioriza eventos que digan "final" en el nombre; si no hay, usa el más próximo
    let objetivo = futuros.find(e => e.evento.toLowerCase().includes('final'));
    if (!objetivo) objetivo = futuros[0];

    const fechaObjetivo = new Date(objetivo.fecha + 'T00:00:00');
    const diasFaltantes = Math.round((fechaObjetivo - hoy) / (1000 * 60 * 60 * 24));

    let texto;
    if (diasFaltantes === 0) {
      texto = `📅 ¡Hoy es "${objetivo.evento}"!`;
    } else if (diasFaltantes === 1) {
      texto = `⏳ Falta 1 día para "${objetivo.evento}"`;
    } else {
      texto = `⏳ Faltan ${diasFaltantes} días para "${objetivo.evento}"`;
    }

    document.getElementById('contador-regresivo').textContent = texto;
  });
});