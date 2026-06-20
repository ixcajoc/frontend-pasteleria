import axios from 'axios'

// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost/proyecto_pasteleria/api'
const API_URL = import.meta.env.VITE_API_URL || 'https://ixcajoc.freedev.app/api'

// Instancia de Axios
const http = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
})

// Ingredientes
export const ingredientesApi = {
  listar: () => http.get('/ingredientes.php'),
  obtener: (id) => http.get(`/ingredientes.php?id=${id}`),
  crear: (datos) => http.post('/ingredientes.php', datos),
  actualizar: (datos) => http.put('/ingredientes.php', datos),
  eliminar: (id) => http.delete(`/ingredientes.php?id=${id}`)
}

// Pasteles
export const pastelesApi = {
  listar: () => http.get('/pasteles.php'),
  obtener: (id) => http.get(`/pasteles.php?id=${id}`),
  crear: (datos) => http.post('/pasteles.php', datos),
  actualizar: (datos) => http.put('/pasteles.php', datos),
  eliminar: (id) => http.delete(`/pasteles.php?id=${id}`)
}

// asignación de ingredientes a pasteles
export const pastelIngredientesApi = {
  listarPorPastel: (idPastel) => http.get(`/pastel-ingredientes.php?id_pastel=${idPastel}`),
  asignar: (datos) => http.post('/pastel-ingredientes.php', datos),
  eliminar: (idPastel, idIngrediente) =>
    http.delete(`/pastel-ingredientes.php?id_pastel=${idPastel}&id_ingrediente=${idIngrediente}`)
}

// Reporte
export const reporteApi = {
  obtener: () => http.get('/reporte.php')
}

// Login
export const authApi = {
  login: (credenciales) => http.post('/login.php', credenciales)
}

export default http
