import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@views/Home.vue'),
    },
    {
      path: '/webgis',
      component: () => import('@views/WebGIS/index.vue'),
      children: [{
        path: 'leaflet',
        name: 'webgis-leaflet',
        component: () => import('@views/WebGIS/leaflet.vue'),
      },{
        path: 'openlayers',
        name: 'webgis-openlayers',
        component: () => import('@views/WebGIS/openlayers.vue'),
      }
    ]
    },
    {
      path: '/three',
      component: () => import('@views/ThreeJs/index.vue'),
      children: [{
        path: 'demo1',
        name: 'three-demo1',
        component: () => import('@views/ThreeJs/demo1.vue'),
      }]
    },
    {
      path: '/websockets',
      name: 'websockets',
      component: () => import('@views/WebSockets.vue'),
    },
    {
      path: '/iat',
      name: 'iat',
      component: () => import('@views/iat.vue'),
    },
  ],
})

router.beforeEach((to, from, next) => {
  console.log(to);
  
  if (to.path.startsWith('/bigScreen')) {
    window.location.href = window.location.origin + to.path;
  } else {
    next()
  }
})

export default router
