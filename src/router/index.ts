import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/committee', name: 'committee', component: () => import('../views/CommitteeView.vue') },
    { path: '/minutes', name: 'minutes', component: () => import('../views/MinutesView.vue') },
    { path: '/documents', name: 'documents', component: () => import('../views/DocumentsView.vue') },
  ],
})

export default router
