import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  // history: createWebHistory(import.meta.env.BASE_URL),
  history: createWebHistory('/'),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/home.vue'),
    },
    {
      path: '/webgis',
      component: () => import('../views/WebGIS/index.vue'),
      children: [{
        path: 'leaflet',
        name: 'webgis-leaflet',
        component: () => import('../views/WebGIS/leaflet.vue'),
      },{
        path: 'openlayers',
        name: 'webgis-openlayers',
        component: () => import('../views/WebGIS/openlayers.vue'),
      }
    ]
    },
    // {
    //   path: '/cesium',
    //   component: () => import('../views/Cesium/index.vue'),
    //   children: [{
    //     path: 'demo1',
    //     name: 'cesium-demo1',
    //     component: () => import('../views/Cesium/demo1.vue'),
    //   }]
    // },
    {
      path: '/three',
      component: () => import('../views/ThreeJs/index.vue'),
      children: [{
        path: 'demo1',
        name: 'three-demo1',
        component: () => import('../views/ThreeJs/demo1.vue'),
      }]
    },
  ],
})

export default router
