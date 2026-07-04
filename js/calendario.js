fetch('data/eventos.json')
  .then(res => res.json())
  .then(eventos => {
    eventos.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

    const cuerpo = document.getElementById('cuerpo-eventos');
    eventos.forEach(e => {
      cuerpo.innerHTML += `
        <tr>
          <td>${e.fecha}</td>
          <td>${e.evento}</td>
          <td>${e.tipo}</td>
        </tr>
      `;
    });
  });