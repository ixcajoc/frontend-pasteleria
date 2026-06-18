<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { pastelesApi } from '../services/api'

const router = useRouter()

const pasteles = ref([])
const cargando = ref(false)
const error = ref('')

// Año actual para del footer
const anio = new Date().getFullYear()

// imagenes para alternar en las tarjetas de los pasteles
const imgPasteles = [
  'https://content-cocina.lecturas.com/medio/2025/05/08/pastel-de-fresas-y-mascarpone_b378a12b_250508120737_1200x1200.webp',
  'https://cdn7.kiwilimon.com/brightcove/10410/640x640/10410.jpg.webp',
  'https://assets.tmecosys.com/image/upload/t_web_rdp_recipe_584x480_1_5x/img/recipe/ras/Assets/5054EE1D-15EE-412C-8AA1-72A4DA244E34/Derivates/90ADA8E1-6472-4BC8-9846-E06D88BE4211.jpg',
  'https://dulcesintencionesbcn.com/cdn/shop/files/IMG_8156.jpg?v=1743583272&width=533',
  'https://fatdaddios.com/wp-content/uploads/2025/09/white-cake-on-a-stand-1024x675.png'
]


function imgPastelPara(index) {
  return imgPasteles[index % imgPasteles.length]
}

function formatearFecha(fecha) {
  if (!fecha) return null
  // formato YYYY-MM-DD original
  const partes = String(fecha).split('-')
  if (partes.length !== 3) return fecha
  const [a, m, d] = partes
  return `${d}/${m}/${a}`
}

async function cargarPasteles() {
  cargando.value = true
  error.value = ''
  try {
    const { data } = await pastelesApi.listar()
    pasteles.value = data.data || []
  } catch (e) {
    error.value = 'No se pudo cargar el catálogo de pasteles. Verifique el servidor.'
  } finally {
    cargando.value = false
  }
}

function irALogin() {
  router.push('/login')
}

function scrollA(id) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}

onMounted(cargarPasteles)
</script>

<template>
  <div class="home">
    <!-- ----------- HEADER -->
    <header class="home-header">
      <div class="home-header__inner">
        <a class="home-brand" href="#" @click.prevent="scrollA('inicio')">
          <img src="../assets/logo2.png" alt="Pasteleria Quetzal" style="height: 70px; object-fit: contain;" />
        </a>

        <nav class="home-nav">
          <a class="home-nav__link" href="#sobre-nosotros" @click.prevent="scrollA('sobre-nosotros')">Sobre Nosotros</a>
          <a class="home-nav__link" href="#catalogo" @click.prevent="scrollA('catalogo')">Catálogo</a>
          <button class="btn-login" @click="irALogin">Iniciar Sesión</button>
        </nav>
      </div>
    </header>

    <!------------ BANNER ------------------------->
    <section id="inicio" class="banner">
      <div class="banner__overlay">
        <h1 class="banner__title">Pastelería Quetzal</h1>
        <p class="banner__subtitle">Endulzando momentos al estilo chapín</p>
        <button class="banner__cta" @click="scrollA('catalogo')">Ver nuestros pasteles</button>
      </div>
    </section>

    <!------------ SOBRE NOSOTROS -------->
    <section id="sobre-nosotros" class="section sobre">
      <div class="container">
        <h2 class="section__title">Sobre Nosotros</h2>
        <div class="section__divider"></div>
        <div class="sobre__grid">
          <div class="sobre__text">
            <p>
              En <strong>Pastelería Quetzal</strong> llevamos más de una década horneando felicidad.
              Cada pastel se elabora de manera artesanal, seleccionando los ingredientes más
              frescos y de la mejor calidad para garantizar un sabor inolvidable.
            </p>
            <p>
              Nuestra pasión por la repostería nos impulsa a crear creaciones únicas para cada
              ocasión: cumpleaños, bodas, aniversarios o simplemente para darte un capricho.
              Mezclamos tradición y creatividad en cada bocado.
            </p>
          </div>
          <div class="sobre__features">
            <div class="feature">
              <img src="../assets/ingredientes.jpg" alt="Ingredientes Frescos" class="card__image" />
              <div class="text__feature">
                <h3>Ingredientes Frescos</h3>
                <p>Seleccionamos lo mejor cada día.</p>
              </div>
            </div>
            <div class="feature">
              <img src="../assets/artesanal.jpg" alt="Hecho a Mano" class="card__image" />
              <div class="text__feature">
                <h3>Hecho a Mano</h3>
                <p>Repostería 100% artesanal.</p>
              </div>
            </div>
            <div class="feature">
              <img src="../assets/con_amor.jpg" alt="Con Amor" class="card__image" />
              <div class="text__feature">
                <h3>Con Amor</h3>
                <p>Cada detalle pensado para ti.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!------ CATÁLOGO DE PASTELES ------->
    <section id="catalogo" class="section catalogo">
      <div class="container">
        <h2 class="section__title">Nuestros Pasteles</h2>
        <div class="section__divider"></div>

        <!-- Estado de carga -->
        <div v-if="cargando" class="estado">
          <span class="spinner"></span>
          <p>Cargando pasteles...</p>
        </div>

        <!-- Estado de error -->
        <div v-else-if="error" class="estado estado--error">
          <p>⚠️ {{ error }}</p>
          <button class="btn-login" @click="cargarPasteles">Reintentar</button>
        </div>

        <!-- Sin resultados -->
        <div v-else-if="pasteles.length === 0" class="estado">
          <p>Aún no hay pasteles disponibles. ¡Vuelve pronto!</p>
        </div>

        <!-- Grid de tarjetas -->
        <div v-else class="grid">
          <article
            v-for="(pastel, index) in pasteles"
            :key="pastel.id_pastel"
            class="cake-card"
          >
            <div class="cake-card__media">
               <img :src="imgPastelPara(index)" :alt="pastel.nombre" class="card__image" />
            </div>
            <div class="cake-card__body">
              <h3 class="cake-card__title">{{ pastel.nombre }}</h3>
              <p class="cake-card__desc">{{ pastel.descripcion || 'Delicioso pastel artesanal.' }}</p>
              <ul class="cake-card__meta">
                <li v-if="pastel.preparado_por">
                  <span>Preparado por:</span> {{ pastel.preparado_por }}
                </li>
                <li v-if="formatearFecha(pastel.fecha_creacion)">
                  <span>Elaborado:</span> {{ formatearFecha(pastel.fecha_creacion) }}
                </li>
              </ul>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- FOOTER ------ -->
    <footer class="footer">
      <div class="container footer__inner">
        <div class="footer__col">
          <h4>Pasteleria Quetzal</h4>
          <p>Endulzando momentos al estilo chapín</p>
        </div>
        <div class="footer__col">
          <h4>Contacto</h4>
          <p>Ciudad de Guatemala</p>
          <p>+502 1234 5678</p>
          <p>correo@pasteleriaquetzal.com</p>
        </div>
        <div class="footer__col">
          <h4>Horario</h4>
          <p>Lun - Vie: 10:00 - 19:00</p>
          <p>Sáb - Dom: 9:00 - 14:00</p>
        </div>
        <div class="footer__col">
          <p><strong>Nota:</strong> Me he inspirado en la temática de esta página en un proyecto personal: </p>
          <a href="https://ixcajoc.github.io/denis-cafe/"  class="footer__link">
            <strong>Blog de Cafe</strong>
          </a>
        </div>
      </div>
      <div class="footer__bottom">
        <a class="footer__link" 
          href="https://ixcajoc.github.io/portafolio/">
            <p>© {{ anio }} Pasteleria Quetzal. Todos los derechos reservados.</p> 
            <p>Creado con esfuerzo, Denis Ixcajoc.</p>
        </a>
      </div>
    </footer>
  </div>
</template>

<style scoped>
/* --- Paleta de colores y tipografia--- */
.home {
  --rosa: #f7b7c3;
  --rosa-suave: #fde7ec;
  --marron: #8d4a2f;
  --marron-suave: #b5805f;
  --crema: #fff8f2;
  --texto: #4a3b33;
  font-family: 'Segoe UI', system-ui, sans-serif;
  color: var(--texto);
  background-color: var(--crema);
}

/* --------Header----- */
.home-header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(255, 248, 242, 0.95);
  backdrop-filter: blur(6px);
  box-shadow: 0 2px 12px rgba(141, 74, 47, 0.12);
}
.home-header__inner {
  max-width: 1150px;
  margin: 0 auto;
  padding: 0.85rem 1.25rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}
.home-brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: var(--marron);
  font-weight: 800;
  font-size: 1.35rem;
}
.home-brand__icon { font-size: 1.6rem; }
.home-nav {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}
.home-nav__link {
  text-decoration: none;
  color: var(--texto);
  font-weight: 600;
  transition: color 0.2s;
}
.home-nav__link:hover { color: var(--marron); }
.btn-login {
  border: none;
  background: var(--marron);
  color: #fff;
  font-weight: 700;
  padding: 0.55rem 1.25rem;
  border-radius: 999px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(247, 183, 195, 0.6);
  transition: transform 0.15s, box-shadow 0.2s;
}
.btn-login:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(141, 74, 47, 0.35);
}

/* -----Banner ---------- */
.banner {
  position: relative;
  min-height: 78vh;
  background-image: url('https://pastelerialostulipanes.com/wp-content/uploads/2022/02/MediaNoche.jpg');
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}
.banner__overlay {
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.445), rgba(0, 0, 0, 0.45));
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
}
.banner__title {
  color: #fff;
  font-size: clamp(2.5rem, 7vw, 5rem);
  font-weight: 900;
  letter-spacing: 1px;
  text-shadow: 0 4px 18px rgba(0, 0, 0, 0.4);
  margin: 0;
}
.banner__subtitle {
  color: #fff;
  font-size: clamp(1rem, 2.5vw, 1.4rem);
  max-width: 620px;
  margin: 1rem auto 1.75rem;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.45);
}
.banner__cta {
  border: none;
  background: #fff;
  color: var(--marron);
  font-weight: 800;
  font-size: 1.05rem;
  padding: 0.85rem 2rem;
  border-radius: 999px;
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
  transition: transform 0.15s, background 0.2s;
}
.banner__cta:hover {
  transform: translateY(-3px) scale(1.03);
  background: var(--rosa-suave);
}

/* ---------- estilso generales---- */
.container {
  max-width: 1150px;
  margin: 0 auto;
  padding: 0 1.25rem;
}
.section { padding: 4rem 0; }
.section__title {
  text-align: center;
  font-size: clamp(1.8rem, 4vw, 2.6rem);
  font-weight: 800;
  color: var(--marron);
  margin: 0;
}
.section__divider {
  width: 80px;
  height: 4px;
  border-radius: 4px;
  margin: 0.85rem auto 2.5rem;
  background: linear-gradient(90deg, var(--rosa), var(--marron-suave));
}

/* ---------- Sobre Nosotros ---------- ----*/
.sobre { background: var(--rosa-suave); }
/* .sobre__grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 2.5rem;
  align-items: center;
} */
.sobre__text p {
  font-size: 1.08rem;
  line-height: 1.8;
  margin-bottom: 1rem;
}
.sobre__features {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1.25rem;
}

.feature {
  background: #fff;
  border-radius: 16px;
  /* padding: 1.25rem 1.5rem; */
  box-shadow: 0 4px 16px rgba(141, 74, 47, 0.1);
  transition: transform 0.2s;
}
.feature:hover { transform: translateX(6px); }
.feature__icon { font-size: 1.8rem; }
.feature h3 {
  margin: 0.4rem 0 0.2rem;
  font-size: 1.15rem;
  color: var(--marron);
}
.feature p { margin: 0; color: var(--marron-suave); }
.card__image{
  width: 100%;
  height: 150px;
  object-fit: cover;
}
.text__feature {
  padding: 1.25rem 1.5rem;
}

/* ------ Catálogo ----- */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1.75rem;
}
.cake-card {
  background: #fff;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 6px 20px rgba(141, 74, 47, 0.12);
  transition: transform 0.2s, box-shadow 0.2s;
  display: flex;
  flex-direction: column;
}
.cake-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 14px 30px rgba(141, 74, 47, 0.22);
}
.cake-card__media {
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--rosa), var(--rosa-suave));
}
.cake-card__emoji { font-size: 4.5rem; }
.cake-card__body { padding: 1.25rem; display: flex; flex-direction: column; gap: 0.5rem; flex: 1; }
.cake-card__title {
  margin: 0;
  font-size: 1.25rem;
  color: var(--marron);
  font-weight: 800;
}
.cake-card__desc {
  margin: 0;
  color: var(--texto);
  font-size: 0.95rem;
  line-height: 1.5;
  flex: 1;
}
.cake-card__meta {
  list-style: none;
  padding: 0;
  margin: 0.5rem 0 0;
  font-size: 0.85rem;
  color: var(--marron-suave);
}
.cake-card__meta li { margin-bottom: 0.2rem; }
.cake-card__meta span { font-weight: 700; }

/* ---------- Estados ---------- */
.estado {
  text-align: center;
  padding: 2.5rem 1rem;
  color: var(--marron-suave);
  font-size: 1.1rem;
}
.estado--error { color: #b94a48; }
.spinner {
  display: inline-block;
  width: 38px;
  height: 38px;
  border: 4px solid var(--rosa);
  border-top-color: var(--marron);
  border-radius: 50%;
  animation: girar 0.8s linear infinite;
  margin-bottom: 0.75rem;
}
@keyframes girar { to { transform: rotate(360deg); } }

/* ---------- Footer ---------- */
.footer {
  background: var(--marron);
  color: #fbe8df;
  padding-top: 3rem;
}
.footer__inner {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 2rem;
  padding-bottom: 2rem;
}
.footer__col h4 {
  color: #fff;
  margin: 0 0 0.75rem;
  font-size: 1.15rem;
}
.footer__col p { margin: 0.3rem 0; font-size: 0.95rem; }
.footer__bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.15);
  text-align: center;
  padding: 1.1rem;
  font-size: 0.9rem;
}
.footer__bottom p { margin: 0; }

.footer__link {
  color: #fbe8df;
  text-decoration: none;
  transition: color 0.2s;
}
.footer__link:hover { 
  color: #fff;
  text-decoration: underline;
 }
/* ---------- Responsive ---------- */
@media (max-width: 768px) {
  .sobre__grid { grid-template-columns: 1fr; }
  .home-nav { gap: 0.85rem; }
  .home-nav__link { display: none; }
  .banner { min-height: 65vh; }
  .sobre__features {  grid-template-columns: 1fr;}
}
</style>
