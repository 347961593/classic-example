<script setup>
import { RouterView } from "vue-router";
import Menu from "./components/Menu.vue";
</script>

<template>
  <div id="main-root">
    <header>
      <Menu />
    </header>
    <main>
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
#main-root{
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  font-weight: normal;
}
header {
  line-height: 1.5;
}
main{
  padding: 1rem 0;
}
</style>
