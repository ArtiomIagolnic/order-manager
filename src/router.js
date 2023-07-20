import { createRouter, createWebHistory } from 'vue-router'

import AppCustomersList from '@/pages/customers/index.vue'
import AppProductsList from '@/pages/products/index.vue'

const routes = [
    {
        name: 'customers',
        path: '/customers',
        component: AppCustomersList
    },
    {
        name: 'products',
        path: '/products',
        component: AppProductsList
    }
]

export default createRouter({
    routes,
    history: createWebHistory()
})