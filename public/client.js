const registerForm = document.getElementById('registerForm');
const loginForm = document.getElementById('loginForm');
const perfilBtn = document.getElementById('perfilBtn');
const logoutBtn = document.getElementById('logoutBtn');

// Registro
if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!username || !password) {
      alert('Debes completar todos los campos.');
      return;
    }

    try {
      const res = await fetch('/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();
      alert(data.mensaje || data.error);
    } catch (error) {
      console.error(error);
      alert('Error al registrar usuario.');
    }
  });
}

// Login
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!username || !password) {
      alert('Debes completar todos los campos.');
      return;
    }

    try {
      const res = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (data.token) {
        localStorage.setItem('token', data.token);
        alert('Login exitoso');
        window.location.href = '/perfil.html'; // 🔥 importante
      } else {
        alert(data.error || 'Error al iniciar sesión');
      }
    } catch (error) {
      console.error(error);
      alert('Error de conexión con el servidor.');
    }
  });
}

// Acceder a ruta protegida
if (perfilBtn) {
  perfilBtn.addEventListener('click', async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      alert('Debes iniciar sesión primero.');
      return;
    }

    try {
      const res = await fetch('/perfil', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();
      alert(JSON.stringify(data, null, 2));
    } catch (error) {
      console.error(error);
      alert('Error al acceder al perfil.');
    }
  });
}

// Logout
if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('token');
    alert('Sesión cerrada');
    window.location.href = '/login.html';
  });
}