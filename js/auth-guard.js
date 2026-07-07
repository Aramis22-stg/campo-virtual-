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