// import './assets/main.css'

import { createApp } from 'vue'
import Index from './index.vue'
import router from './router.js'
import ElementPlus from 'element-plus'
import { createPinia } from 'pinia'
import 'element-plus/dist/index.css'

const app = createApp(Index)

app.use(router)
app.use(ElementPlus)
app.use(createPinia())

app.mount('#bigScreen')
