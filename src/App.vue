<script setup>
import { computed } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'

const route = useRoute()

// vistas publicas, se oculta navbar admin
const rutasPublicas = ['home', 'login']
const mostrarNavbar = computed(() => !rutasPublicas.includes(route.name))
</script>

<template>
  <!-- Navbar del panel admin  -->
  <nav v-if="mostrarNavbar" class="navbar navbar-expand-lg navbar-dark" style="background-color:#8d4a2f;">
    <div class="container-fluid main-container">
      <RouterLink class="navbar-brand" to="/">
        <div style="display: flex; align-items: center;">
          <div class="logoNav"></div>
          Pastelería Quetzal
        </div>
      </RouterLink>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">

        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <RouterLink class="nav-link" to="/ingredientes">Ingredientes</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/pasteles">Pasteles</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/maestro-detalle">Asignar Ingredientes</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/reporte">Reporte</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/">Cerrar Sesión</RouterLink>
          </li>
        </ul>
      </div>
    </div>
  </nav>


  <!-- Contenido de cada vista según la ruta -->
  <main :class="{ 'main-container': mostrarNavbar }">
      
      <RouterView />
    
  </main>
</template>


<style scoped>

.logoNav {
  position: relative;
  min-height: 50px;
  width: 50px;
  background-image: url('assets/quetzal.png');
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

</style>