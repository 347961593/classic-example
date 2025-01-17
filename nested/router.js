import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  
  routes: [
    {
      path: '/bigScreen',
      // name: 'home',
      // component: () => import('./views/Home.vue'),
      // component: () => import('./views/Cesium/index.vue'),
      redirect: '/bigScreen/cesium',
      children: [
        {
          path: 'cesium',
          name: 'cesium',
          component: () => import('./views/Cesium/index.vue'),
          children: [
            {
              path: 'demo1',
              name: 'cesium-demo1',
              component: () => import('./views/Cesium/demo1.vue'),
            }
          ]
        }
      ]
    },
  ],
})

export default router
