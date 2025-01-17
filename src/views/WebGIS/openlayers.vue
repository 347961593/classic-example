<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import Map from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'
import { defaults as defaultControls, FullScreen } from "ol/control";
import { Draw, Modify } from 'ol/interaction'
import { Vector as VectorLayer } from 'ol/layer'
import { Vector as VectorSource } from 'ol/source'
import { Circle } from 'ol/geom'
import { buffer } from '@turf/turf'
import { fromLonLat } from 'ol/proj'
import Feature from 'ol/Feature'
import {ElMessage} from 'element-plus'
import { useMapStore } from '@/stores/mapStore'
const store = useMapStore()

const mapContainer = ref(null)
const map = ref(null)
const drawInteraction = ref(null)
const vectorSource = ref(new VectorSource())
const vectorLayer = ref(new VectorLayer({
  source: vectorSource.value
}))

onMounted(() => {
  // 初始化地图
  map.value = new Map({
    target: 'olMap',
    layers: [
      new TileLayer({
        source: new OSM()
      }),
      vectorLayer.value
    ],
    view: new View({
      center: fromLonLat([114.502, 38.045]), // 使用经纬度坐标
      zoom: 12
    }),
    controls: defaultControls({
      attribution: false,
      zoom: true,
      rotate: false,
    }),
  })
  map.value.addControl(new FullScreen())
})

const startBuffer = () => {
  if (drawInteraction.value) {
    map.value.removeInteraction(drawInteraction.value)
  }
  
  drawInteraction.value = new Draw({
    source: vectorSource.value,
    type: 'Point'
  })
  
 drawInteraction.value.on('drawend', async (evt) => {
    const feature = evt.feature
    const geometry = feature.getGeometry()
    const coordinates = geometry.getCoordinates()
    
    // 调用分析API
    await store.performBufferAnalysis(coordinates, 1000) // 1000米缓冲区
    
    // 显示分析结果
    if (store.analysisResult) {
      // 在地图上显示缓冲区
      const bufferedFeature = new Feature({
        geometry: new Circle(coordinates, store.analysisResult.radius)
      })
      vectorSource.value.addFeature(bufferedFeature)
      
      // 显示受影响的点数
      ElMessage.success(`缓冲区内包含 ${store.analysisResult.affectedPoints} 个点`)
    }
  })
  
  map.value.addInteraction(drawInteraction.value)
}

const startMeasure = () => {
  if (drawInteraction.value) {
    map.value.removeInteraction(drawInteraction.value)
  }
  
  drawInteraction.value = new Draw({
    source: vectorSource.value,
    type: 'LineString'
  })

  drawInteraction.value.on('drawend', (evt) => {
    const feature = evt.feature
    const geometry = feature.getGeometry()
    const length = geometry.getLength()
    
    // 显示测量结果
    ElMessage.success(`距离: ${(length/1000).toFixed(2)} 公里`)
  })
  
  map.value.addInteraction(drawInteraction.value)
}

onUnmounted(() => {
  if (map.value) {
    map.value.setTarget(null)
  }
})
</script>

<template>
  <div class="map-container">
    <div class="tools">
      <el-button-group>
        <el-button @click="startBuffer">缓冲区分析</el-button>
        <el-button @click="startMeasure">测距</el-button>
      </el-button-group>
    </div>
    <div id="olMap" ref="mapContainer"></div>
  </div>
</template>

<style scoped>
.map-container {
  width: 100%;
  height: 800px;
}
#olMap{
  width: 100%;
  height: 100%;
}
:deep(.ol-full-screen) {
  position: absolute;
  right: 0;
  top: 0;
}
</style>