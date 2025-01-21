<script setup>
defineProps({
  // msg: {
  //   type: String,
  //   required: true,
  // },
})
</script>

<template>
  <el-menu
    ellipsis
    class="el-menu-popper-demo"
    mode="horizontal"
    :popper-offset="16"
    style="max-width: 600px"
    router
    default-active=""
  >
    <!-- <el-menu-item index="/">Home</el-menu-item> -->
    <el-sub-menu index="/webgis">
      <template #title>WebGIS</template>
      <el-menu-item index="/webgis/leaflet">Leaflet聚合展示</el-menu-item>
      <el-menu-item index="/webgis/openlayers">OpenLayers空间分析</el-menu-item>
    </el-sub-menu>
        <el-sub-menu index="/cesium">
      <template #title>CesiumJS</template>
      <el-menu-item index="/bigScreen/cesium/demo1">demo1</el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="/three">
      <template #title>Three.js</template>
      <el-menu-item index="/three/demo1">demo1</el-menu-item>
    </el-sub-menu>
    <!-- <el-sub-menu index="3" :popper-offset="8">
      <template #title>Override Popper Offset</template>
      <el-menu-item index="3-1">item one</el-menu-item>
      <el-menu-item index="3-2">item two</el-menu-item>
      <el-menu-item index="3-3">item three</el-menu-item>
      <el-sub-menu index="3-4" :popper-offset="20">
        <template #title>override child</template>
        <el-menu-item index="3-4-1">item one</el-menu-item>
        <el-menu-item index="3-4-2">item two</el-menu-item>
        <el-menu-item index="3-4-3">item three</el-menu-item>
      </el-sub-menu>
    </el-sub-menu>
    <el-menu-item index="4" disabled>Info</el-menu-item>
    <el-menu-item index="5">Orders</el-menu-item> -->
  </el-menu>
</template>

<style scoped>
</style>
