<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as Cesium from 'cesium';
import { Cartographic, Color, SkyBox } from 'cesium';
import { useCesiumStore } from '@/stores/cesiumStore'
import cesium_bgc from '@assets/imgs/cesium_bgc.jpg'

const store = useCesiumStore()
function addMarker() {
  if (store.viewer) {
    store.viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(-75.59777, 40.03883),
        point: { pixelSize: 10, color: Cesium.Color.RED }
    });
  }
}
onMounted(() => {
  addMarker()
})

function setBackgroundColor(color) {
  // 修改背景色
  store.viewer.scene.backgroundColor = Color.fromCssColorString(color);
  // 背景色要生效需要隐藏天空盒
  store.viewer.scene.skyBox.show = false;

  // 我这里为了效果正常一点，隐藏了太阳，月亮
  store.viewer.scene.sun.show = false;
  store.viewer.scene.moon.show = false;
}
function recoverBackgroundColor() {
  store.viewer.scene.backgroundColor = Color.BLACK;
  store.viewer.scene.skyBox.show = true;

  store.viewer.scene.sun.show = true;
  store.viewer.scene.moon.show = true;
}
function setBackgroundImage(url) {
    // 修改背景色透明度0.0
    store.viewer.scene.backgroundColor = new Color(0.0, 0.0, 0.0, 0.0);
    store.viewer.scene.skyBox.show = false;

    store.viewer.scene.sun.show = false;
    store.viewer.scene.moon.show = false;

    // 找到html元素，修改背景css
    store.viewer.container.style.backgroundImage = 'url(' + url + ')';
    store.viewer.container.style.backgroundRepeat = 'no-repeat';
    store.viewer.container.style.backgroundSize = '100% 100%';
  }
function recoverBackgroundImage() {
    store.viewer.scene.backgroundColor = Color.BLACK;
    store.viewer.scene.skyBox.show = true;

    store.viewer.scene.sun.show = true;
    store.viewer.scene.moon.show = true;

    store.viewer.container.style.backgroundImage = null;
    store.viewer.container.style.backgroundRepeat = null;
    store.viewer.container.style.backgroundSize = null;
  }
  function setSkyBoxFar(sources) {
    store.viewer.scene.skyBoxFar = new SkyBox({
      sources: sources
    });
    store.viewer.scene.skyBox = store.viewer.skyBoxFar;
  }
  function recoverSkyBoxFar() {
    store.viewer.scene.skyBox = store.viewer.skyBoxDefault;

    store.viewer.skyBoxFar = store.viewer.skyBoxDefault;
  }
 function setSkyBoxNear(sources) {
    store.viewer.skyBoxNear = new SkyBox({
      sources: sources
    });
    store.viewer.scene.skyBox = store.viewer.skyBoxNear;

    if (store.viewer.skyBoxNearListenerRemoveCallback) return;
    //  绑定事件监听，根据高度动态修改不同的天空盒
    store.viewer.skyBoxNearListenerRemoveCallback = store.viewer.scene.postRender.addEventListener(() => {
      let e = store.viewer.camera.position;
      if (Cartographic.fromCartesian(e).height < 20000) {
        store.viewer.scene.skyBox = store.viewer.skyBoxNear;
        store.viewer.scene.skyAtmosphere.show = false;
        store.viewer.scene.sun.show = false;
        store.viewer.scene.moon.show = false;
      } else {
        store.viewer.scene.skyBox = store.viewer.skyBoxFar;
        store.viewer.scene.skyAtmosphere.show = true;
        store.viewer.scene.sun.show = true;
        store.viewer.scene.moon.show = true;
      }
    });
  }
  function recoverSkyBoxNear() {
    store.viewer.scene.skyBox = store.viewer.skyBoxDefault;
    store.viewer.scene.skyAtmosphere.show = true;

    if (store.viewer.skyBoxNearListenerRemoveCallback) {
      store.viewer.skyBoxNearListenerRemoveCallback();
      store.viewer.skyBoxNearListenerRemoveCallback = null;
    }

    store.viewer.skyBoxNear = store.viewer.skyBoxDefault;
  }

</script>

<template>

  <div class="cesiumContainer" v-if="store.viewer">
    <el-button type="primary" @click="setBackgroundColor('#409eff')">改变背景色</el-button>
    <el-button type="primary" @click="recoverBackgroundColor()">复原背景色</el-button>
    <el-button type="primary" @click="setBackgroundImage(cesium_bgc)">改变背景图片</el-button>
    <el-button type="primary" @click="recoverBackgroundImage()">复原背景图片</el-button>
    <el-button type="primary">设置远景天空盒</el-button>
    <el-button type="primary">复原远景天空盒</el-button>
    <el-button type="primary">设置近景天空盒</el-button>
    <el-button type="primary">复原近景天空盒</el-button>
  </div>
</template>

<style scoped>
.cesiumContainer {
  position: absolute;
  top: 2px;
  left: 2px;
  z-index: 999;
}
</style>
