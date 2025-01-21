<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

window.CESIUM_BASE_URL = '/';

import {
  Cartesian3,
  createOsmBuildingsAsync,
  Ion,
  Math as CesiumMath,
  Terrain,
  Viewer,
  KmlDataSource,
  // Sandcastle
} from 'cesium';
import "cesium/Build/Cesium/Widgets/widgets.css";

// Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxYmRiZmVkOS1kNTFmLTRiMjQtYjc0Mi1mMDNjMTg1MTVhZGEiLCJpZCI6MjY4NDg4LCJpYXQiOjE3MzY3MDQ2ODV9.M23Q0g6lozIqtQFoZNoeOT0E0fmLqmIHue9QonAaXi8';

// const viewer = new Viewer('cesiumContainer', {
//   terrain: Terrain.fromWorldTerrain(),
// });    

// viewer.camera.flyTo({
//   destination: Cartesian3.fromDegrees(-122.4175, 37.655, 400),
//   orientation: {
//     heading: CesiumMath.toRadians(0.0),
//     pitch: CesiumMath.toRadians(-15.0),
//   }
// });

// const buildingTileset = await createOsmBuildingsAsync();
// viewer.scene.primitives.add(buildingTileset);  

//////
const viewer = new Viewer("cesiumContainer");
const options = {
  camera: viewer.scene.camera,
  canvas: viewer.scene.canvas,
};

let tour = null;
viewer.dataSources
  .add(
    // Cesium.KmlDataSource.load(
    KmlDataSource.load(
      "../SampleData/kml/eiffel-tower-flyto.kml",
      options,
    ),
  )
  .then(function (dataSource) {
    tour = dataSource.kmlTours[0];
    tour.tourStart.addEventListener(function () {
      console.log("Start tour");
    });
    tour.tourEnd.addEventListener(function (terminated) {
      console.log(`${terminated ? "Terminate" : "End"} tour`);
    });
    tour.entryStart.addEventListener(function (entry) {
      console.log(`Play ${entry.type} (${entry.duration})`);
    });
    tour.entryEnd.addEventListener(function (entry, terminated) {
      console.log(`${terminated ? "Terminate" : "End"} ${entry.type}`);
    });
  });

Sandcastle.addToolbarButton("Play", function () {
  tour.play(viewer.cesiumWidget);
});

Sandcastle.addToolbarButton("Terminate", function () {
  tour.stop();
});

Sandcastle.reset = function () {
  viewer.dataSources.removeAll();
  viewer.clock.clockRange = Cesium.ClockRange.UNBOUNDED;
  viewer.clock.clockStep = Cesium.ClockStep.SYSTEM_CLOCK;
};

onMounted(() => {

})
</script>

<template>
   <div id="cesiumContainer" class="fullSize"></div>
    <div id="loadingOverlay"><h1>Loading...</h1></div>
    <div id="toolbar"></div>
</template>

<style scoped>
</style>
