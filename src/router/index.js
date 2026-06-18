import { createRouter, createWebHashHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import IngredientesView from '../views/IngredientesView.vue'
import PastelesView from '../views/PastelesView.vue'
import MaestroDetalleView from '../views/MaestroDetalleView.vue'
import ReporteView from '../views/ReporteView.vue'

const routes = [
  { path: '/', redirect: '/home' },
  { path: '/home', name: 'home', component: HomeView },
  { path: '/login', name: 'login', component: LoginView },
  { path: '/ingredientes', name: 'ingredientes', component: IngredientesView },
  { path: '/pasteles', name: 'pasteles', component: PastelesView },
  { path: '/maestro-detalle', name: 'maestro-detalle', component: MaestroDetalleView },
  { path: '/reporte', name: 'reporte', component: ReporteView }
]

const router = createRouter({
  // createWebHashHistory usa URLs con # para mas facil
  history: createWebHashHistory(),
  routes
})

export default router
