auth.onAuthStateChanged((user) => {
  if (!user) return;
  document.getElementById('texto-correo-perfil').textContent = user.email;
  document.getElementById('input-nombre').value = user.displayName || '';
});

document.getElementById('btn-guardar-nombre').addEventListener('click', () => {
  const nombre = document.getElementById('input-nombre').value.trim();
  const mensaje = document.getElementById('mensaje-nombre');

  if (!nombre) {
    mensaje.style.color = 'red';
    mensaje.textContent = 'Escribe un nombre.';
    return;
  }

  auth.currentUser.updateProfile({ displayName: nombre })
    .then(() => {
      mensaje.style.color = 'green';
      mensaje.textContent = '¡Nombre actualizado!';
      mostrarGuardado();
    })
    .catch((error) => {
      mensaje.style.color = 'red';
      mensaje.textContent = 'Error: ' + error.message;
    });
});

document.getElementById('btn-cambiar-clave').addEventListener('click', () => {
  const claveActual = document.getElementById('input-clave-actual').value;
  const claveNueva = document.getElementById('input-clave-nueva').value;
  const mensaje = document.getElementById('mensaje-clave');

  if (!claveActual || !claveNueva) {
    mensaje.style.color = 'red';
    mensaje.textContent = 'Completa ambos campos.';
    return;
  }
  if (claveNueva.length < 6) {
    mensaje.style.color = 'red';
    mensaje.textContent = 'La nueva contraseña debe tener al menos 6 caracteres.';
    return;
  }

  const user = auth.currentUser;
  const credencial = firebase.auth.EmailAuthProvider.credential(user.email, claveActual);

  user.reauthenticateWithCredential(credencial)
    .then(() => user.updatePassword(claveNueva))
    .then(() => {
      mensaje.style.color = 'green';
      mensaje.textContent = '¡Contraseña actualizada!';
      document.getElementById('input-clave-actual').value = '';
      document.getElementById('input-clave-nueva').value = '';
    })
    .catch((error) => {
      mensaje.style.color = 'red';
      mensaje.textContent = 'Error: ' + (error.code === 'auth/wrong-password' ? 'La contraseña actual es incorrecta.' : error.message);
    });
});

document.getElementById('btn-exportar').addEventListener('click', () => {
  const user = auth.currentUser;
  db.ref('usuarios/' + user.uid).once('value').then((snapshot) => {
    const datos = snapshot.val() || {};
    const contenido = JSON.stringify(datos, null, 2);
    const blob = new Blob([contenido], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const enlace = document.createElement('a');
    enlace.href = url;
    enlace.download = 'respaldo-portal-estudiante.json';
    enlace.click();
    URL.revokeObjectURL(url);
  });
});

document.getElementById('btn-importar').addEventListener('click', () => {
  const archivo = document.getElementById('input-importar').files[0];
  const mensaje = document.getElementById('mensaje-datos');

  if (!archivo) {
    mensaje.style.color = 'red';
    mensaje.textContent = 'Selecciona un archivo primero.';
    return;
  }

  const confirmar = confirm('Esto reemplazará tus datos actuales por los del archivo. ¿Continuar?');
  if (!confirmar) return;

  const lector = new FileReader();
  lector.onload = (e) => {
    try {
      const datos = JSON.parse(e.target.result);
      const user = auth.currentUser;
      db.ref('usuarios/' + user.uid).set(datos).then(() => {
        mensaje.style.color = 'green';
        mensaje.textContent = '¡Datos restaurados correctamente!';
        mostrarGuardado();
      });
    } catch (error) {
      mensaje.style.color = 'red';
      mensaje.textContent = 'El archivo no es un respaldo válido.';
    }
  };
  lector.readAsText(archivo);
});