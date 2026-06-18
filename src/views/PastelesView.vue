<script setup>

import { ref, onMounted, reactive } from 'vue'
import { pastelesApi } from '../services/api'
import AlertMessage from '../components/AlertMessage.vue'

const pasteles = ref([])
const cargando = ref(false)

const alerta = reactive({ tipo: 'success', mensaje: '' })
function mostrarAlerta(tipo, mensaje) {
  alerta.tipo = tipo
  alerta.mensaje = mensaje
}
function cerrarAlerta() {
  alerta.mensaje = ''
}

const form = reactive({
  id_pastel: null,
  nombre: '',
  descripcion: '',
  preparado_por: '',
  fecha_creacion: '',
  fecha_vencimiento: ''
})
const errores = reactive({})
const editando = ref(false)

async function cargarPasteles() {
  cargando.value = true
  try {
    const { data } = await pastelesApi.listar()
    pasteles.value = data.data || []
  } catch (e) {
    mostrarAlerta('danger', 'No se pudo cargar la lista de pasteles. Verifique el backend.')
  } finally {
    cargando.value = false
  }
}

function validar() {
  Object.keys(errores).forEach((k) => delete errores[k])
  if (!form.nombre || form.nombre.trim() === '') {
    errores.nombre = 'El nombre es obligatorio.'
  }
  if (form.fecha_creacion && form.fecha_vencimiento && form.fecha_vencimiento < form.fecha_creacion) {
    errores.fecha_vencimiento = 'La fecha de vencimiento no puede ser anterior a la creación.'
  }
  return Object.keys(errores).length === 0
}

async function guardar() {
  if (!validar()) return
  try {
    if (editando.value) {
      await pastelesApi.actualizar({ ...form })
      mostrarAlerta('success', 'Pastel actualizado correctamente.')
    } else {
      await pastelesApi.crear({ ...form })
      mostrarAlerta('success', 'Pastel creado correctamente.')
    }
    limpiarFormulario()
    cargarPasteles()
  } catch (e) {
    mostrarAlerta('danger', e.response?.data?.message || 'Ocurrió un error al guardar.')
  }
}

function editar(item) {
  editando.value = true
  form.id_pastel = item.id_pastel
  form.nombre = item.nombre || ''
  form.descripcion = item.descripcion || ''
  form.preparado_por = item.preparado_por || ''
  form.fecha_creacion = item.fecha_creacion || ''
  form.fecha_vencimiento = item.fecha_vencimiento || ''
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

async function eliminar(id) {
  if (!confirm('¿Está seguro de eliminar este pastel? También se eliminarán sus ingredientes asignados.')) return
  try {
    await pastelesApi.eliminar(id)
    mostrarAlerta('success', 'Pastel eliminado correctamente.')
    cargarPasteles()
  } catch (e) {
    mostrarAlerta('danger', e.response?.data?.message || 'No se pudo eliminar.')
  }
}

function limpiarFormulario() {
  editando.value = false
  form.id_pastel = null
  form.nombre = ''
  form.descripcion = ''
  form.preparado_por = ''
  form.fecha_creacion = ''
  form.fecha_vencimiento = ''
  Object.keys(errores).forEach((k) => delete errores[k])
}

onMounted(cargarPasteles)
</script>

<template>
  <h2 class="mb-4">Gestión de Pasteles</h2>

  <AlertMessage :tipo="alerta.tipo" :mensaje="alerta.mensaje" @cerrar="cerrarAlerta" />

  <!-- Formulario -->
  <div class="card mb-4">
    <div class="card-header fw-bold">
      {{ editando ? 'Editar pastel' : 'Nuevo pastel' }}
    </div>
    <div class="card-body">
      <form @submit.prevent="guardar">
        <div class="row g-3">
          <div class="col-md-6">
            <label class="form-label">Nombre <span class="text-danger">*</span></label>
            <input v-model="form.nombre" type="text" class="form-control" placeholder="Ej: Pastel de Chocolate" />
            <div v-if="errores.nombre" class="error-text">{{ errores.nombre }}</div>
          </div>
          <div class="col-md-6">
            <label class="form-label">Preparado por</label>
            <input v-model="form.preparado_por" type="text" class="form-control" placeholder="Nombre del repostero" />
          </div>
          <div class="col-12">
            <label class="form-label">Descripción</label>
            <textarea v-model="form.descripcion" class="form-control" rows="2" placeholder="Descripción del pastel"></textarea>
          </div>
          <div class="col-md-6">
            <label class="form-label">Fecha de creación</label>
            <input v-model="form.fecha_creacion" type="date" class="form-control" />
          </div>
          <div class="col-md-6">
            <label class="form-label">Fecha de vencimiento</label>
            <input v-model="form.fecha_vencimiento" type="date" class="form-control" />
            <div v-if="errores.fecha_vencimiento" class="error-text">{{ errores.fecha_vencimiento }}</div>
          </div>
        </div>
        <div class="mt-3">
          <button type="submit" class="btn btn-primary">
            {{ editando ? 'Actualizar' : 'Guardar' }}
          </button>
          <button v-if="editando" type="button" class="btn btn-secondary ms-2" @click="limpiarFormulario">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  </div>

  <!-- Tabla -->
  <div class="card">
    <div class="card-header fw-bold">Lista de pasteles</div>
    <div class="card-body">
      <div v-if="cargando" class="text-center text-muted py-3">Cargando...</div>
      <div v-else-if="pasteles.length === 0" class="text-center text-muted py-3">
        No hay pasteles registrados.
      </div>
      <div v-else class="table-responsive">
        <table class="table table-hover align-middle">
          <thead class="table-light">
            <tr>
              <th>#</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Preparado por</th>
              <th>Creación</th>
              <th>Vencimiento</th>
              <th class="text-end">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in pasteles" :key="item.id_pastel">
              <td>{{ item.id_pastel }}</td>
              <td>{{ item.nombre }}</td>
              <td>{{ item.descripcion || '—' }}</td>
              <td>{{ item.preparado_por || '—' }}</td>
              <td>{{ item.fecha_creacion || '—' }}</td>
              <td>{{ item.fecha_vencimiento || '—' }}</td>
              <td class="text-end">
                <button class="btn btn-sm btn-outline-primary me-1" @click="editar(item)">Editar</button>
                <button class="btn btn-sm btn-outline-danger" @click="eliminar(item.id_pastel)">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
