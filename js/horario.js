fetch('data/ramos.json')
  .then(res => res.json())
  .then(ramos => {
const cuerpo = document.getElementById('cuerpo-horario');    ramos.forEach(r => {
      cuerpo.innerHTML += `<tr><td>${r.dia}</td><td>${r.hora}</td><td>${r.ramo}</td><td>${r.sala}</td></tr>`;
    });
  });