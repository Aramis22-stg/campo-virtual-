const btnRegistrar = document.getElementById('btn-registrar');
const mensaje = document.getElementById('mensaje');

btnRegistrar.addEventListener('click', () => {
  const correo = document.getElementById('input-correo').value;
  const clave = document.getElementById('input-clave').value;

  if (!correo || !clave) {
    mensaje.textContent = 'Por favor completa correo y contraseña.';
    mensaje.style.color = 'red';
    return;
  }

  auth.createUserWithEmailAndPassword(correo, clave)
    .then((cred) => {
      return cred.user.sendEmailVerification();
    })
    .then(() => {
      mensaje.style.color = 'green';
      mensaje.textContent = '¡Cuenta creada! Revisa tu correo y haz click en el link de verificación antes de iniciar sesión.';
      auth.signOut();
    })
    .catch((error) => {
      mensaje.style.color = 'red';
      mensaje.textContent = 'Error: ' + error.message;
    });
});