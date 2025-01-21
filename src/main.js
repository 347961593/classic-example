import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import bigScreen from './views/bigScreen/index.vue'
import router from './router'
import bigScreenRouter from './router/bigScreenRouter.js'
import ElementPlus from 'element-plus'
import { createPinia } from 'pinia'
import 'element-plus/dist/index.css'

const pathname = location.pathname
let app
if (pathname.startsWith('/bigScreen')) {
    app = createApp(bigScreen)
    app.use(bigScreenRouter)
}else{
    app = createApp(App)
    app.use(router)
}

app.use(ElementPlus)
app.use(createPinia())

app.mount('#app')
