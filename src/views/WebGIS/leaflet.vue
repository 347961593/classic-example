<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import L from 'leaflet'
import 'leaflet.markercluster'
import 'leaflet/dist/leaflet.css'
import icon from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'

// 图标设置
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
})
L.Marker.prototype.options.icon = DefaultIcon

// 响应式引用
const map = ref(null)
const tileLayer = ref(null)
const clusterLayer = ref(null)
const searchMarkers = ref(new L.LayerGroup())  // 用于管理搜索结果的标记
const searchKeyword = ref('')  // 搜索关键词
const isLoading = ref(false)
const hasError = ref(false)

// 初始化地图
const initMap = () => {
  map.value = L.map('map', {attributionControl: false}).setView([38.045, 114.502], 13)
  
  tileLayer.value = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map.value)
}

// 添加图层控制
let layerControl = null

const addLayerControl = () => {
  const baseMaps = {
    "OpenStreetMap": tileLayer.value,
    "卫星图": L.tileLayer('https://webst0{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}', {
      subdomains: ['1', '2', '3', '4'],
      maxZoom: 18,
    })
  }

  const overlayMaps = {
    "搜索结果": searchMarkers.value
  }
  
  layerControl = L.control.layers(baseMaps, overlayMaps).addTo(map.value)
  
  // 监听图层切换事件
  map.value.on('overlayadd', (e) => {
    if (e.name === '搜索结果' && clusterLayer.value) {
      map.value.addLayer(clusterLayer.value)
    }
  })
  
  map.value.on('overlayremove', (e) => {
    if (e.name === '搜索结果' && clusterLayer.value) {
      map.value.removeLayer(clusterLayer.value)
    }
  })
}

// 添加点击事件
const addClickEvent = () => {
  map.value.on('click', (e) => {
    const { lat, lng } = e.latlng
    L.popup()
      .setLatLng(e.latlng)
      .setContent(`坐标: ${lat.toFixed(4)}, ${lng.toFixed(4)}`)
      .openOn(map.value)
  })
}

// 搜索POI
const searchPOI = async () => {
  if (!searchKeyword.value.trim()) {
    alert('请输入搜索关键词');
    return;
  }

  isLoading.value = true;
  hasError.value = false;

  const KEY = 'b5256a61e251e1cd52dad24625d09e14';
  const center = map.value.getCenter();
  
  try {
    //清除图标
    searchMarkers.value.clearLayers();

    const response = await fetch(
      `https://restapi.amap.com/v3/place/around?` +
      `key=${KEY}&` +
      `location=${center.lng},${center.lat}&` +
      `keywords=${encodeURIComponent(searchKeyword.value)}&` +
      `radius=5000&` +
      `offset=50&` +
      `page=1`
    );
    
    const data = await response.json();
    
    if (data.status === '1' && data.pois && data.pois.length > 0) {
        // 清除之前的聚合图层
      if (clusterLayer.value) {
        map.value.removeLayer(clusterLayer.value);
      }
      // 创建聚合图层
      clusterLayer.value = L.markerClusterGroup({
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: false,
        zoomToBoundsOnClick: true
      });
      
      data.pois.forEach(poi => {
        const [lng, lat] = poi.location.split(',').map(Number);
        
        if (lng && lat) {
          const marker = L.marker([lat, lng])
            .bindPopup(`
              <div style="min-width: 200px;">
                <h3>${poi.name}</h3>
                <p>类型: ${poi.type}</p>
                <p>地址: ${poi.address || '暂无地址'}</p>
                <p>电话: ${poi.tel || '暂无电话'}</p>
              </div>
            `);
          clusterLayer.value.addLayer(marker);
        }
      });
      
      // 添加聚合图层到地图
      map.value.addLayer(clusterLayer.value);
      
      // 调整地图视图以显示所有标记
      map.value.fitBounds(clusterLayer.value.getBounds(), {padding: [50, 50]});
      
      // 自动勾选搜索结果图层
      if (!map.value.hasLayer(searchMarkers.value)) {
        map.value.addLayer(searchMarkers.value);
      }
      
    } else {
      alert('未找到相关地点');
    }
  } catch (error) {
    console.error('搜索失败:', error);
    hasError.value = true;
  } finally {
    isLoading.value = false;
  }
}

// 组件生命周期钩子
onMounted(() => {
  initMap()
  addLayerControl()
  addClickEvent()
})

onBeforeUnmount(() => {
  if (map.value) {
    if (clusterLayer.value) {
      map.value.removeLayer(clusterLayer.value);
    }
    if (searchMarkers.value) {
      map.value.removeLayer(searchMarkers.value);
    }
    map.value.remove()
  }
})
</script>

<template>
  <div>
    <div>
      <span class="title-size">城市公共设施查询系统</span>
      <span>（ 高德地图 ）</span>
    </div>
    <!-- 搜索框 -->
    <div class="search-container">
      <input 
        v-model="searchKeyword"
        type="text"
        placeholder="输入要搜索的地点（如：餐厅、公园、医院等）"
        @keyup.enter="searchPOI"
      />
      <button @click="searchPOI" :disabled="isLoading">
        {{ isLoading ? '搜索中...' : '搜索' }}
      </button>
    </div>

    <!-- 加载和错误提示 -->
    <div v-if="isLoading" class="status-message loading">正在搜索...</div>
    <div v-if="hasError" class="status-message error">搜索失败，请重试</div>

    <!-- 地图容器 -->
    <div id="map" class="map-container"></div>
  </div>
</template>

<style scoped>
.title-size{
  font-size: 28px;
}
.map-container {
  height: 800px;
  width: 100%;
}

.search-container {
  margin: 10px 0;
  display: flex;
  gap: 10px;
}

.search-container input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.search-container button {
  padding: 8px 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.search-container button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.status-message {
  position: fixed;
  top: 10px;
  right: 10px;
  padding: 10px;
  border-radius: 4px;
  z-index: 1000;
}

.loading {
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.error {
  background-color: #fee;
  color: #c00;
}
</style>