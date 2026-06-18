<script setup>
// Funciona con la api, pero sino, valida con credenciales quemadas, la idea es que siempre funcione el login en esta prueba

import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { authApi } from '../services/api'

const router = useRouter()

const form = reactive({
  usuario: '',
  contrasena: ''
})

const errores = reactive({})
const errorGeneral = ref('')
const cargando = ref(false)
const verContrasena = ref(false)

// Credenciales quemadas, por si no funcionara la api
const CREDENCIALES = { usuario: 'admin', contrasena: 'admin123' }

function validar() {
  Object.keys(errores).forEach((k) => delete errores[k])
  if (!form.usuario || form.usuario.trim() === '') {
    errores.usuario = 'El usuario es obligatorio.'
  }
  if (!form.contrasena || form.contrasena.trim() === '') {
    errores.contrasena = 'La contraseña es obligatoria.'
  }
  return Object.keys(errores).length === 0
}

async function iniciarSesion() {
  errorGeneral.value = ''
  if (!validar()) return

  cargando.value = true
  try {
    // Utenticacion en el backend
    const { data } = await authApi.login({
      usuario: form.usuario.trim(),
      contrasena: form.contrasena
    })

    if (data.success) {
      onLoginExitoso()
    } else {
      errorGeneral.value = data.message || 'Usuario o contraseña incorrectos.'
    }
  } catch (e) {
    // aqui si el backend no llegara a responde, usa las claves quemadas
    if (
      form.usuario.trim() === CREDENCIALES.usuario &&
      form.contrasena === CREDENCIALES.contrasena
    ) {
      onLoginExitoso()
    } else {
      errorGeneral.value =
        e.response?.data?.message || 'Usuario o contraseña incorrectos.'
    }
  } finally {
    cargando.value = false
  }
}

function onLoginExitoso() {
  try {
    sessionStorage.setItem('autenticado', 'true')
  } catch (e) {
  }
  router.push('/pasteles')
}
</script>

<template>
  <div class="login-page">
    <div class="login-card">
      <button class="login-back" @click="router.push('/home')">← Volver al inicio</button>
      <div class="login-header">
          <img src="../assets/logo2.png" alt="Pasteleria Quetzal" style="height: 50px; object-fit: contain; margin: 20px;" />
        <h1 class="login-title">Bienvenido</h1>
        <p class="login-subtitle">Ingresa al panel de administración de Pasteleria Quetzal</p>
      </div>

      <!-- Mensaje de error general -->
      <div v-if="errorGeneral" class="login-error">
        ⚠️ {{ errorGeneral }}
      </div>

      <form @submit.prevent="iniciarSesion" novalidate>
        <div class="form-group">
          <label for="usuario">Usuario</label>
          <input
            id="usuario"
            v-model="form.usuario"
            type="text"
            autocomplete="username"
            placeholder="admin"
            :class="{ invalido: errores.usuario }"
          />
          <span v-if="errores.usuario" class="campo-error">{{ errores.usuario }}</span>
        </div>

        <div class="form-group">
          <label for="contrasena">Contraseña</label>
          <div class="password-wrap">
            <input
              id="contrasena"
              v-model="form.contrasena"
              :type="verContrasena ? 'text' : 'password'"
              autocomplete="current-password"
              placeholder="••••••••"
              :class="{ invalido: errores.contrasena }"
            />
            <button
              type="button"
              class="toggle-pass"
              @click="verContrasena = !verContrasena"
              :aria-label="verContrasena ? 'Ocultar contraseña' : 'Mostrar contraseña'"
            >
              <!-- {{ 
              verContrasena ? 'ojo cerrado': 'ojo abierto' 
              }} -->
            </button>
          </div>
          <span v-if="errores.contrasena" class="campo-error">{{ errores.contrasena }}</span>
        </div>

        <button type="submit" class="btn-submit" :disabled="cargando">
          <span v-if="cargando" class="spinner"></span>
          {{ cargando ? 'Ingresando...' : 'Iniciar Sesión' }}
        </button>
      </form>

      <p class="login-hint">Usuario de prueba: <strong>admin</strong> / <strong>admin123</strong></p>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  --rosa: #f7b7c3;
  --rosa-suave: #fde7ec;
  --marron: #8d4a2f;
  --marron-suave: #b5805f;
  --texto: #4a3b33;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  background: linear-gradient(135deg, #fde7ec 0%, #fff8f2 50%, #f5e1d3 100%);
  font-family: 'Segoe UI', system-ui, sans-serif;
}

.login-card {
  position: relative;
  width: 100%;
  max-width: 410px;
  background: #fff;
  border-radius: 22px;
  padding: 2.5rem 2rem 2rem;
  box-shadow: 0 18px 45px rgba(141, 74, 47, 0.22);
}

.login-back {
  position: absolute;
  top: 1rem;
  left: 1rem;
  border: none;
  background: transparent;
  color: var(--marron-suave);
  font-weight: 600;
  cursor: pointer;
  font-size: 0.85rem;
}
.login-back:hover { color: var(--marron); }

.login-header {
  text-align: center;
  margin-bottom: 1.75rem;
}
.login-logo { font-size: 3rem; }
.login-title {
  margin: 0.4rem 0 0.3rem;
  color: var(--marron);
  font-weight: 800;
  font-size: 1.8rem;
}
.login-subtitle {
  margin: 0;
  color: var(--marron-suave);
  font-size: 0.95rem;
}

.login-error {
  background: #fdecea;
  color: #b94a48;
  border: 1px solid #f3c0bb;
  border-radius: 12px;
  padding: 0.7rem 1rem;
  font-size: 0.9rem;
  margin-bottom: 1.25rem;
  text-align: center;
}

.form-group {
  margin-bottom: 1.15rem;
  display: flex;
  flex-direction: column;
}
.form-group label {
  font-weight: 700;
  color: var(--texto);
  margin-bottom: 0.4rem;
  font-size: 0.9rem;
}
.form-group input {
  width: 100%;
  padding: 0.75rem 0.9rem;
  border: 2px solid #f0ddd2;
  border-radius: 12px;
  font-size: 1rem;
  transition: border-color 0.2s, box-shadow 0.2s;
  background: #fffdfc;
  box-sizing: border-box;
}
.form-group input:focus {
  outline: none;
  border-color: var(--rosa);
  box-shadow: 0 0 0 3px rgba(247, 183, 195, 0.4);
}
.form-group input.invalido {
  border-color: #e09b96;
}

.password-wrap { position: relative; }
.password-wrap input { padding-right: 2.8rem; }
.toggle-pass {
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 1.1rem;
}

.campo-error {
  color: #b94a48;
  font-size: 0.8rem;
  margin-top: 0.3rem;
}

.btn-submit {
  width: 100%;
  border: none;
  background: linear-gradient(135deg, var(--rosa), var(--marron-suave));
  color: #fff;
  font-weight: 800;
  font-size: 1.05rem;
  padding: 0.85rem;
  border-radius: 12px;
  cursor: pointer;
  margin-top: 0.4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  box-shadow: 0 6px 16px rgba(247, 183, 195, 0.55);
  transition: transform 0.15s, box-shadow 0.2s, opacity 0.2s;
}
.btn-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 9px 22px rgba(141, 74, 47, 0.32);
}
.btn-submit:disabled { opacity: 0.7; cursor: not-allowed; }

.spinner {
  width: 18px;
  height: 18px;
  border: 3px solid rgba(255, 255, 255, 0.5);
  border-top-color: #fff;
  border-radius: 50%;
  animation: girar 0.7s linear infinite;
}
@keyframes girar { to { transform: rotate(360deg); } }

.login-hint {
  text-align: center;
  margin: 1.4rem 0 0;
  font-size: 0.82rem;
  color: var(--marron-suave);
}

@media (max-width: 480px) {
  .login-card { padding: 2.25rem 1.4rem 1.75rem; }
}
</style>
