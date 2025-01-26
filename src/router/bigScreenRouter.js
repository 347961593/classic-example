import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  
  routes: [
    {
      path: '/bigScreen',
      redirect: '/bigScreen/cesium',
      children: [
        {
          path: 'cesium',
          name: 'cesium',
          component: () => import('@views/bigScreen/Cesium/index.vue'),
          children: [
            {
              path: 'monitor',
              name: 'cesium-monitor',
              component: () => import('@views/bigScreen/Cesium/monitor.vue'),
            }
          ]
        }
      ]
    },
  ],
})

export default router
