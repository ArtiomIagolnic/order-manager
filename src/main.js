import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import {useProductStore} from './store/product.js'

import '@/assets/index.css'

import App from './App.vue'

const pinia = createPinia()
const app = createApp(App)

// Initialize base products
useProductStore(pinia).initializeBaseProducts()

app.use(pinia).use(router).mount('#app')
