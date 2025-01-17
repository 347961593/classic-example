<script setup>
import { onMounted } from 'vue'
import { RouterView } from "vue-router";
import { initializeCesium } from '../../utils/cesium.js';

onMounted(() => {
  initializeCesium('MapContainer')
  // initializeCesium('app')
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
  height: 98vh;
  margin: 0;
  padding: 0;
}
</style>
