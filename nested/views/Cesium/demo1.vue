<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

import { getViewer } from '../../utils/cesium.js';
import * as Cesium from 'cesium';
function addMarker() {
  const viewer = getViewer();
  if (viewer) {
    viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(-75.59777, 40.03883),
        point: { pixelSize: 10, color: Cesium.Color.RED }
    });
  }
}

onMounted(() => {
  addMarker()
})
</script>

<template>
  <div>
    <!-- <h1>Functionality A</h1> -->
  </div>

</template>

<style scoped>
</style>
