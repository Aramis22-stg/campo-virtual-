const btnLogin = document.getElementById('btn-login');
const mensaje = document.getElementById('mensaje');

btnLogin.addEventListener('click', () => {
  const correo = document.getElementById('input-correo').value;
  const clave = document.getElementById('input-clave').value;

  if (!correo || !clave) {
    mensaje.style.color = 'red';
    mensaje.textContent = 'Por favor completa correo y contraseña.';
    return;
  }

  auth.signInWithEmailAndPassword(correo, clave)
    .then((cred) => {
      if (!cred.user.emailVerified) {
        mensaje.style.color = 'red';
        mensaje.textContent = 'Debes verificar tu correo antes de iniciar sesión. Revisa tu bandeja de entrada.';
        auth.signOut();
        return;
      }
      mensaje.style.color = 'green';
      mensaje.textContent = '¡Bienvenido! Entrando...';
      window.location.href = 'index.html';
    })
    .catch((error) => {
      mensaje.style.color = 'red';
      mensaje.textContent = 'Error: ' + error.message;
    });
});
document.getElementById('link-olvide').addEventListener('click', (e) => {
  e.preventDefault();
  const correo = document.getElementById('input-correo').value;

  if (!correo) {
    mensaje.style.color = 'red';
    mensaje.textContent = 'Escribe tu correo arriba y luego click en "¿Olvidaste tu contraseña?".';
    return;
  }

  auth.sendPasswordResetEmail(correo)
    .then(() => {
      mensaje.style.color = 'green';
      mensaje.textContent = 'Te enviamos un correo para restablecer tu contraseña. Revisa tu bandeja de entrada (y spam).';
    })
    .catch((error) => {
      mensaje.style.color = 'red';
      mensaje.textContent = 'Error: ' + error.message;
    });
});