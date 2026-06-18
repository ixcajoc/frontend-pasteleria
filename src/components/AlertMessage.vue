<script setup>
defineProps({
  tipo: { type: String, default: 'success' }, // success | danger | warning | info
  mensaje: { type: String, default: '' }
})
defineEmits(['cerrar'])
</script>

<template>
  <div
    v-if="mensaje"
    :class="`alert alert-${tipo} alert-dismissible d-flex align-items-center`"
    role="alert"
  >
    <span>{{ mensaje }}</span>
    <button type="button" class="btn-close" @click="$emit('cerrar')"></button>
  </div>
</template>
