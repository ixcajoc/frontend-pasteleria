<script setup>
import { ref, onMounted, reactive } from 'vue'
import { pastelesApi, ingredientesApi, pastelIngredientesApi } from '../services/api'
import AlertMessage from '../components/AlertMessage.vue'

const pasteles = ref([])
const ingredientes = ref([])
const asignados = ref([])

const pastelSeleccionado = ref('')   // id del pastel elegido
const cargandoAsignados = ref(false)

const alerta = reactive({ tipo: 'success', mensaje: '' })
function mostrarAlerta(tipo, mensaje) {
  alerta.tipo = tipo
  alerta.mensaje = mensaje
}
function cerrarAlerta() {
  alerta.mensaje = ''
}

// Formulario de asignación
const nuevo = reactive({ id_ingrediente: '', cantidad: '' })
const errorAsignar = ref('')

// ----- Cargar combos ----
async function cargarDatosIniciales() {
  try {
    const [resP, resI] = await Promise.all([pastelesApi.listar(), ingredientesApi.listar()])
    pasteles.value = resP.data.data || []
    ingredientes.value = resI.data.data || []
  } catch (e) {
    mostrarAlerta('danger', 'No se pudieron cargar pasteles/ingredientes. Verifique el backend.')
  }
}

// ----- Cargar ingredientes asignados al pastel ----
async function cargarAsignados() {
  if (!pastelSeleccionado.value) {
    asignados.value = []
    return
  }
  cargandoAsignados.value = true
  try {
    const { data } = await pastelIngredientesApi.listarPorPastel(pastelSeleccionado.value)
    asignados.value = data.data || []
  } catch (e) {
    mostrarAlerta('danger', 'No se pudieron cargar los ingredientes asignados.')
  } finally {
    cargandoAsignados.value = false
  }
}

// -- Asignar ingrediente ----------
async function asignar() {
  errorAsignar.value = ''
  if (!pastelSeleccionado.value) {
    errorAsignar.value = 'Seleccione primero un pastel.'
    return
  }
  if (!nuevo.id_ingrediente) {
    errorAsignar.value = 'Seleccione un ingrediente.'
    return
  }
  try {
    await pastelIngredientesApi.asignar({
      id_pastel: Number(pastelSeleccionado.value),
      id_ingrediente: Number(nuevo.id_ingrediente),
      cantidad: nuevo.cantidad
    })
    mostrarAlerta('success', 'Ingrediente asignado al pastel.')
    nuevo.id_ingrediente = ''
    nuevo.cantidad = ''
    cargarAsignados()
  } catch (e) {
    mostrarAlerta('danger', e.response?.data?.message || 'No se pudo asignar el ingrediente.')
  }
}

// ---Quitar asignación -------------
async function quitar(idIngrediente) {
  if (!confirm('¿Quitar este ingrediente del pastel?')) return
  try {
    await pastelIngredientesApi.eliminar(pastelSeleccionado.value, idIngrediente)
    mostrarAlerta('success', 'Ingrediente quitado del pastel.')
    cargarAsignados()
  } catch (e) {
    mostrarAlerta('danger', e.response?.data?.message || 'No se pudo quitar el ingrediente.')
  }
}

onMounted(cargarDatosIniciales)
</script>

<template>
  <div class="detalle-section">
    <h2 class="mb-4 section__title">Asignar Ingredientes a Pasteles (Maestro - Detalle)</h2>

    <AlertMessage :tipo="alerta.tipo" :mensaje="alerta.mensaje" @cerrar="cerrarAlerta" />

    <!-- MAESTRO: selección del pastel -->
    <div class="card mb-4">
      <div class="card-header fw-bold">1. Seleccione un pastel</div>
      <div class="card-body">
        <select v-model="pastelSeleccionado" class="form-select" @change="cargarAsignados">
          <option value="">-- Seleccione un pastel --</option>
          <option v-for="p in pasteles" :key="p.id_pastel" :value="p.id_pastel">
            {{ p.nombre }}
          </option>
        </select>
      </div>
    </div>

    <!-- DETALLE: asignación de ingredientes -->
    <div v-if="pastelSeleccionado" class="card mb-4">
      <div class="card-header fw-bold">2. Agregar ingrediente al pastel</div>
      <div class="card-body">
        <div class="row g-3 align-items-end">
          <div class="col-md-5">
            <label class="form-label">Ingrediente</label>
            <select v-model="nuevo.id_ingrediente" class="form-select">
              <option value="">-- Seleccione --</option>
              <option v-for="i in ingredientes" :key="i.id_ingrediente" :value="i.id_ingrediente">
                {{ i.nombre }}
              </option>
            </select>
          </div>
          <div class="col-md-4">
            <label class="form-label">Cantidad (opcional)</label>
            <input v-model="nuevo.cantidad" type="text" class="form-control" placeholder="Ej: 200 g" />
          </div>
          <div class="col-md-3">
            <button class="btn btn-form w-100" @click="asignar">Asignar</button>
          </div>
        </div>
        <div v-if="errorAsignar" class="error-text mt-2">{{ errorAsignar }}</div>
      </div>
    </div>

    <!-- Lista de ingredientes asignados -->
    <div v-if="pastelSeleccionado" class="card">
      <div class="card-header fw-bold">Ingredientes asignados a este pastel</div>
      <div class="card-body">
        <div v-if="cargandoAsignados" class="text-center text-muted py-3">Cargando...</div>
        <div v-else-if="asignados.length === 0" class="text-center text-muted py-3">
          Este pastel aún no tiene ingredientes asignados.
        </div>
        <div v-else class="table-responsive">
          <table class="table table-hover align-middle">
            <thead class="table-light">
              <tr>
                <th>Ingrediente</th>
                <th>Descripción</th>
                <th>Cantidad</th>
                <th class="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="a in asignados" :key="a.id_pastel_ingrediente">
                <td>{{ a.ingrediente_nombre }}</td>
                <td>{{ a.ingrediente_descripcion || '—' }}</td>
                <td>{{ a.cantidad || '—' }}</td>
                <td class="text-end">
                  <button class="btn btn-sm btn-outline-danger" @click="quitar(a.id_ingrediente)">Quitar</button>
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
  .detalle-section {
    --rosa: #f7b7c3;
    --rosa-suave: #fde7ec;
    --marron: #8d4a2f;
    --marron-suave: #b5805f;
    --crema: #fff8f2;
    --texto: #4a3b33;
    font-family: 'Segoe UI', system-ui, sans-serif;
    color: var(--texto);
  }

  .section__title {
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