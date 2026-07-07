// Verifica que haya una sesión activa; si no, redirige al login
auth.onAuthStateChanged((user) => {
  if (!user || !user.emailVerified) {
    window.location.href = 'login.html';
  }
});

// Botón de cerrar sesión (presente en todas las páginas protegidas)
document.addEventListener('DOMContentLoaded', () => {
  const btnLogout = document.getElementById('btn-logout');
  if (btnLogout) {
    btnLogout.addEventListener('click', (e) => {
      e.preventDefault();
      auth.signOut().then(() => {
        window.location.href = 'login.html';
      });
    });
  }
});

// --- Cierre automático por inactividad (9 horas) ---
const TIEMPO_MAXIMO_INACTIVIDAD = 9 * 60 * 60 * 1000; // 9 horas en milisegundos
let temporizadorInactividad;

function reiniciarTemporizador() {
  clearTimeout(temporizadorInactividad);
  temporizadorInactividad = setTimeout(() => {
    auth.signOut().then(() => {
      window.location.href = 'login.html';
    });
  }, TIEMPO_MAXIMO_INACTIVIDAD);
}

['mousemove', 'keydown', 'click', 'scroll', 'touchstart'].forEach(evento => {
  document.addEventListener(evento, reiniciarTemporizador);
});

reiniciarTemporizador();