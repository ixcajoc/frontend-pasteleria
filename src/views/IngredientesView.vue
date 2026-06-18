<script setup>
import { ref, onMounted, reactive } from 'vue'
import { ingredientesApi } from '../services/api'
import AlertMessage from '../components/AlertMessage.vue'

// Estado de la lista
const ingredientes = ref([])
const cargando = ref(false)

// Mensjes de alerta
const alerta = reactive({ tipo: 'success', mensaje: '' })
function mostrarAlerta(tipo, mensaje) {
  alerta.tipo = tipo
  alerta.mensaje = mensaje
}
function cerrarAlerta() {
  alerta.mensaje = ''
}

// Modelo del formulario
const form = reactive({
  id_ingrediente: null,
  nombre: '',
  descripcion: '',
  fecha_ingreso: '',
  fecha_vencimiento: ''
})
const errores = reactive({})
const editando = ref(false)

// ------------------------- Cargar listado -------------------------
async function cargarIngredientes() {
  cargando.value = true
  try {
    const { data } = await ingredientesApi.listar()
    ingredientes.value = data.data || []
  } catch (e) {
    mostrarAlerta('danger', 'No se pudo cargar la lista de ingredientes. Verifique el backend.')
  } finally {
    cargando.value = false
  }
}

// ------------------------- Validación -------------------------
function validar() {
  Object.keys(errores).forEach((k) => delete errores[k])
  if (!form.nombre || form.nombre.trim() === '') {
    errores.nombre = 'El nombre es obligatorio.'
  }
  if (form.fecha_ingreso && form.fecha_vencimiento && form.fecha_vencimiento < form.fecha_ingreso) {
    errores.fecha_vencimiento = 'La fecha de vencimiento no puede ser anterior al ingreso.'
  }
  return Object.keys(errores).length === 0
}

// ------------------------- Guardar (crear/editar) -------------------------
async function guardar() {
  if (!validar()) return
  try {
    if (editando.value) {
      await ingredientesApi.actualizar({ ...form })
      mostrarAlerta('success', 'Ingrediente actualizado correctamente.')
    } else {
      await ingredientesApi.crear({ ...form })
      mostrarAlerta('success', 'Ingrediente creado correctamente.')
    }
    limpiarFormulario()
    cargarIngredientes()
  } catch (e) {
    const msg = e.response?.data?.message || 'Ocurrió un error al guardar.'
    mostrarAlerta('danger', msg)
  }
}

// ------------------------- Editar -------------------------
function editar(item) {
  editando.value = true
  form.id_ingrediente = item.id_ingrediente
  form.nombre = item.nombre || ''
  form.descripcion = item.descripcion || ''
  form.fecha_ingreso = item.fecha_ingreso || ''
  form.fecha_vencimiento = item.fecha_vencimiento || ''
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// ------------------------- Eliminar -------------------------
async function eliminar(id) {
  if (!confirm('¿Está seguro de eliminar este ingrediente?')) return
  try {
    await ingredientesApi.eliminar(id)
    mostrarAlerta('success', 'Ingrediente eliminado correctamente.')
    cargarIngredientes()
  } catch (e) {
    mostrarAlerta('danger', e.response?.data?.message || 'No se pudo eliminar.')
  }
}

// ------------------------- Limpiar formulario -------------------------
function limpiarFormulario() {
  editando.value = false
  form.id_ingrediente = null
  form.nombre = ''
  form.descripcion = ''
  form.fecha_ingreso = ''
  form.fecha_vencimiento = ''
  Object.keys(errores).forEach((k) => delete errores[k])
}

onMounted(cargarIngredientes)
</script>

<template>
  <div class="ingredientes-section">
    <h2 class="mb-4 section__title">Gestión de Ingredientes</h2>

    <AlertMessage :tipo="alerta.tipo" :mensaje="alerta.mensaje" @cerrar="cerrarAlerta" />

    <!-- Formulario de creación / edición -->
    <div class="card mb-4">
      <div class="card-header fw-bold">
        {{ editando ? 'Editar ingrediente' : 'Nuevo ingrediente' }}
      </div>
      <div class="card-body">
        <form @submit.prevent="guardar">
          <div class="row g-3">
            <div class="col-md-6">
              <label class="form-label">Nombre <span class="text-danger">*</span></label>
              <input v-model="form.nombre" type="text" class="form-control" placeholder="Ej: Harina" />
              <div v-if="errores.nombre" class="error-text">{{ errores.nombre }}</div>
            </div>
            <div class="col-md-6">
              <label class="form-label">Descripción</label>
              <input v-model="form.descripcion" type="text" class="form-control" placeholder="Descripción breve" />
            </div>
            <div class="col-md-6">
              <label class="form-label">Fecha de ingreso</label>
              <input v-model="form.fecha_ingreso" type="date" class="form-control" />
            </div>
            <div class="col-md-6">
              <label class="form-label">Fecha de vencimiento</label>
              <input v-model="form.fecha_vencimiento" type="date" class="form-control" />
              <div v-if="errores.fecha_vencimiento" class="error-text">{{ errores.fecha_vencimiento }}</div>
            </div>
          </div>
          <div class="mt-3">
            <button type="submit" class="btn btn-form">
              {{ editando ? 'Actualizar' : 'Guardar' }}
            </button>
            <button v-if="editando" type="button" class="btn btn-secondary ms-2" @click="limpiarFormulario">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Tabla de listado -->
    <div class="card">
      <div class="card-header fw-bold">Lista de ingredientes</div>
      <div class="card-body">
        <div v-if="cargando" class="text-center text-muted py-3">Cargando...</div>
        <div v-else-if="ingredientes.length === 0" class="text-center text-muted py-3">
          No hay ingredientes registrados.
        </div>
        <div v-else class="table-responsive">
          <table class="table table-hover align-middle">
            <thead class="table-light">
              <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Ingreso</th>
                <th>Vencimiento</th>
                <th class="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in ingredientes" :key="item.id_ingrediente">
                <td>{{ item.id_ingrediente }}</td>
                <td>{{ item.nombre }}</td>
                <td>{{ item.descripcion || '—' }}</td>
                <td>{{ item.fecha_ingreso || '—' }}</td>
                <td>{{ item.fecha_vencimiento || '—' }}</td>
                <td class="text-end">
                  <button class="btn btn-sm btn-outline-primary me-1" @click="editar(item)">Editar</button>
                  <button class="btn btn-sm btn-outline-danger" @click="eliminar(item.id_ingrediente)">Eliminar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.ingredientes-section {
  --rosa: #f7b7c3;
  --rosa-suave: #fde7ec;
  --marron: #8d4a2f;
  --marron-suave: #b5805f;
  --crema: #fff8f2;
  --texto: #4a3b33;
  font-family: 'Segoe UI', system-ui, sans-serif;
  color: var(--texto);
  /* background-color: var(--crema); */
}

.section__title {
  /* text-align: center; */
  font-size: clamp(1.8rem, 4vw, 2.6rem);
  font-weight: 800;
  color: var(--marron);
  margin: 0;
}
.btn-form {
  border: none;
  background: var(--marron);
  color: #fff;
  font-weight: 700;
  padding: 0.55rem 1.25rem;
  /* border-radius: 999px; */
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(247, 183, 195, 0.6);
  transition: transform 0.15s, box-shadow 0.2s;
}
.btn-form:hover {
  transform: translateY(-2px);
  background: var(--marron-suave);
  box-shadow: 0 6px 18px rgba(141, 74, 47, 0.35);
}
</style>