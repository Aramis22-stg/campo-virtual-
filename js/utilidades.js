// --- Indicador de guardado automático ---
function mostrarGuardado() {
  let aviso = document.getElementById('aviso-guardado');
  if (!aviso) {
    aviso = document.createElement('div');
    aviso.id = 'aviso-guardado';
    aviso.className = 'aviso-guardado';
    document.body.appendChild(aviso);
  }
  aviso.textContent = '✅ Guardado automáticamente';
  aviso.classList.add('mostrar');
  clearTimeout(window._timeoutAviso);
  window._timeoutAviso = setTimeout(() => {
    aviso.classList.remove('mostrar');
  }, 1800);
}

// --- Dictado por voz ---
function activarDictado(idBoton, idInput) {
  const boton = document.getElementById(idBoton);
  const input = document.getElementById(idInput);
  if (!boton || !input) return;

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    boton.style.display = 'none';
    return;
  }

  const reconocimiento = new SpeechRecognition();
  reconocimiento.lang = 'es-CL';
  reconocimiento.interimResults = false;

  boton.addEventListener('click', () => {
    boton.textContent = '🎙️...';
    reconocimiento.start();
  });

  reconocimiento.onresult = (event) => {
    const texto = event.results[0][0].transcript;
    input.value = texto.charAt(0).toUpperCase() + texto.slice(1);
    boton.textContent = '🎤';
  };

  reconocimiento.onerror = () => {
    boton.textContent = '🎤';
  };

  reconocimiento.onend = () => {
    boton.textContent = '🎤';
  };
}
// --- Modo oscuro ---
function inicializarModoOscuro() {
  const modoGuardado = localStorage.getItem('modoOscuro');
  if (modoGuardado === 'activado') {
    document.body.classList.add('modo-oscuro');
  }

  const boton = document.getElementById('btn-modo-oscuro');
  if (boton) {
    actualizarIconoModoOscuro(boton);
    boton.addEventListener('click', (e) => {
      e.preventDefault();
      document.body.classList.toggle('modo-oscuro');
      const activado = document.body.classList.contains('modo-oscuro');
      localStorage.setItem('modoOscuro', activado ? 'activado' : 'desactivado');
      actualizarIconoModoOscuro(boton);
    });
  }
}

function actualizarIconoModoOscuro(boton) {
  const activado = document.body.classList.contains('modo-oscuro');
  boton.textContent = activado ? '☀️ Modo claro' : '🌙 Modo oscuro';
}

document.addEventListener('DOMContentLoaded', inicializarModoOscuro);