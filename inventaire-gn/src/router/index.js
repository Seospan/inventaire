import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Inventory',
    component: () => import('../views/InventoryView.vue')
  },
  {
    path: '/truck',
    name: 'TruckLoading',
    component: () => import('../views/TruckLoadingView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router