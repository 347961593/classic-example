<script setup>
import { RouterView } from "vue-router";
import Menu from "./components/Menu.vue";
</script>

<template>
  <header>
    <Menu />
  </header>
  <main>
    <RouterView />
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
}
main{
  padding: 1rem 0;
}
</style>
