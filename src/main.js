import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Estilos y js de Bootstrap 
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

// Estilos propios
import './assets/styles.css'

const app = createApp(App)
app.use(router)
app.mount('#app')
