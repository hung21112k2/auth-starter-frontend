import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import SignupView from '@/views/SignupView.vue'
import DashboardView from '@/views/DashboardView.vue'
import { getToken } from '@/services/auth'

const routes = [
  { path: '/', redirect: '/dashboard' },
  { path: '/login', name: 'login', component: LoginView, meta:{ guestOnly: true } },
  { path: '/signup', name: 'signup', component: SignupView, meta:{ guestOnly: true } },
  { path: '/dashboard', name: 'dashboard', component: DashboardView, meta:{ requiresAuth: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const token = getToken()
  if (to.meta.requiresAuth && !token) {
    return { name: 'login' }
  }
  if (to.meta.guestOnly && token) {
    return { name: 'dashboard' }
  }
})

export default router
