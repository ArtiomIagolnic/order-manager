import { createRouter, createWebHistory } from 'vue-router'

import AppCustomersList from '@/pages/customers/index.vue'
import AppProductsList from '@/pages/products/index.vue'
import AppE404 from '@/components/E404.vue'
import AppHomeComponent from '@/components/Home.vue'

const routes = [
    {
        name: 'home',
        path: '/',
        component: AppHomeComponent
    },
    {
        name: 'customers',
        path: '/customers',
        component: AppCustomersList
    },
    {
        name: 'products',
        path: '/products',
        component: AppProductsList
    },
    {
        path: '/:any(.*)',
        component: AppE404
    }
]

export default createRouter({
    routes,
    history: createWebHistory()
})