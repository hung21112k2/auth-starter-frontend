import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import SignupView from '@/views/SignupView.vue'
import DashboardView from '@/views/DashboardView.vue'
import VerifySentView from '@/views/VerifySentView.vue'
import VerifyEmailView from '@/views/VerifyEmailView.vue'
import VerifySuccessView from '@/views/VerifySuccessView.vue'
import ForgotPasswordView from '@/views/ForgotPasswordView.vue'
import ResetPasswordView from '@/views/ResetPasswordView.vue'
import { getToken } from '@/services/auth'

const routes = [
  { path: '/', redirect: '/dashboard' },

  { path: '/login', name: 'login', component: LoginView, meta:{ guestOnly: true } },
  { path: '/signup', name: 'signup', component: SignupView, meta:{ guestOnly: true } },

  { path: '/verify-sent', name: 'verify-sent', component: VerifySentView, meta:{ guestOnly: true } },
  { path: '/verify-email', name: 'verify-email', component: VerifyEmailView, meta:{ guestOnly: true } }, // ?token=
  { path: '/verify-success', name: 'verify-success', component: VerifySuccessView, meta:{ guestOnly: true } },

  { path: '/forgot-password', name: 'forgot-password', component: ForgotPasswordView, meta:{ guestOnly: true } },
  { path: '/reset-password',  name: 'reset-password',  component: ResetPasswordView,  meta:{ guestOnly: true } }, // ?token=

  { path: '/dashboard', name: 'dashboard', component: DashboardView, meta:{ requiresAuth: true } },
]

const router = createRouter({ history: createWebHistory(), routes })

router.beforeEach((to) => {
  const token = getToken()
  if (to.meta.requiresAuth && !token) return { name: 'login' }
  if (to.meta.guestOnly && token) return { name: 'dashboard' }
})

export default router
