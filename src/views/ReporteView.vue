<script setup>

import { ref, onMounted, reactive } from 'vue'
import { reporteApi } from '../services/api'
import AlertMessage from '../components/AlertMessage.vue'

const reporte = ref([])
const cargando = ref(false)

const alerta = reactive({ tipo: 'danger', mensaje: '' })
function cerrarAlerta() {
  alerta.mensaje = ''
}

async function cargarReporte() {
  cargando.value = true
  try {
    const { data } = await reporteApi.obtener()
    reporte.value = data.data || []
  } catch (e) {
    alerta.tipo = 'danger'
    alerta.mensaje = 'No se pudo cargar el reporte. Verifique el backend.'
  } finally {
    cargando.value = false
  }
}

// Imprimer reporte
function imprimir() {
  window.print()
}

onMounted(cargarReporte)
</script>

<template>
  <div class="d-flex justify-content-between align-items-center mb-4">
    <h2 class="mb-0">Reporte de Pasteles y sus Ingredientes</h2>
    <button class="btn btn-outline-secondary" @click="imprimir">Imprimir</button>
  </div>

  <AlertMessage :tipo="alerta.tipo" :mensaje="alerta.mensaje" @cerrar="cerrarAlerta" />

  <div v-if="cargando" class="text-center text-muted py-4">Cargando reporte...</div>

  <div v-else-if="reporte.length === 0" class="text-center text-muted py-4">
    No hay pasteles registrados para mostrar.
  </div>

  <!-- Una tarjeta por cada pastel -->
  <div v-else>
    <div v-for="p in reporte" :key="p.id_pastel" class="card mb-4">
      <div class="card-header" style="background-color:#8d4a2f; color:#fff;">
        <h5 class="mb-0">{{ p.nombre }}</h5>
      </div>
      <div class="card-body">
        <p class="text-muted mb-1" v-if="p.descripcion">{{ p.descripcion }}</p>
        <p class="mb-1"><strong>Preparado por:</strong> {{ p.preparado_por || '—' }}</p>
        <p class="mb-1"><strong>Creación:</strong> {{ p.fecha_creacion || '—' }}</p>
        <p class="mb-3"><strong>Vencimiento:</strong> {{ p.fecha_vencimiento || '—' }}</p>

        <h6 class="fw-bold">Ingredientes:</h6>
        <div v-if="!p.ingredientes || p.ingredientes.length === 0" class="text-muted">
          Sin ingredientes asignados.
        </div>
        <table v-else class="table table-sm table-bordered mt-2">
          <thead class="table-light">
            <tr>
              <th>Ingrediente</th>
              <th>Descripción</th>
              <th>Cantidad</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="ing in p.ingredientes" :key="ing.id_ingrediente">
              <td>{{ ing.nombre }}</td>
              <td>{{ ing.descripcion || '—' }}</td>
              <td>{{ ing.cantidad || '—' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
