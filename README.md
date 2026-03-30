# registro-y-autenticacion

# 🔐 Sistema de Registro y Autenticación con JWT

## 📌 Descripción
Este proyecto consiste en una aplicación desarrollada con Node.js y Express que permite registrar usuarios, autenticarse mediante JSON Web Tokens (JWT) y acceder a rutas protegidas.

El sistema implementa autenticación stateless, donde el servidor no almacena sesiones, sino que valida cada solicitud mediante un token firmado.

---

## ⚙️ Tecnologías utilizadas
- Node.js
- Express
- JSON Web Token (JWT)
- bcryptjs (hash de contraseñas)
- Bootstrap (interfaz)
- JavaScript (frontend)

---

## 🔁 Flujo de funcionamiento

### 1. Registro
El usuario se registra proporcionando un username y password.

- La contraseña es hasheada con bcrypt antes de almacenarse.
- Los usuarios se almacenan en memoria (array `users`).

---

### 2. Login
El usuario ingresa sus credenciales:

- Se validan comparando con bcrypt.
- Si son correctas, se genera un JWT con:
  - username
  - rol
- El token se firma con una clave secreta (`JWT_SECRET`).
- El token se envía al cliente.

---

### 3. Almacenamiento del token
El cliente guarda el token en el navegador usando:

```js
localStorage.setItem('token', token);
