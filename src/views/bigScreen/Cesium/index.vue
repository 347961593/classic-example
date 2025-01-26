<script setup>
import { onMounted } from 'vue'
import { RouterView } from "vue-router";
import { initializeCesium } from '../../../utils/cesium.js';
import { useCesiumStore } from '@/stores/cesiumStore'

const store = useCesiumStore()
onMounted(() => {
  store.initializeCesium('MapContainer')
  // initializeCesium('MapContainer')
})
</script>
<template>
  <div id="MapContainer">
    <RouterView />
  </div>
</template>

<style scoped>
#MapContainer {
  width: 100%;
  height: 100vh;
  margin: 0;
  padding: 0;
  position: relative;
}
</style>
