<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Menubar from 'primevue/menubar'
import Button from 'primevue/button'
import { getToken, clearToken } from '@/services/auth'

const router = useRouter()
const route = useRoute()

const authed = computed(() => !!getToken())

const NO_MENUBAR_ROUTES = [
  'login', 'signup',
  'verify-sent', 'verify-email', 'verify-success',
  'oauth-callback'
]
const hideMenubar = computed(() => NO_MENUBAR_ROUTES.includes(route.name))

const FULL_WIDTH_ROUTES = [
  ...NO_MENUBAR_ROUTES,
  'dashboard'
]
const isFullWidth = computed(() => FULL_WIDTH_ROUTES.includes(route.name))

const needsHeroBg = computed(() => route.name === 'dashboard')

const menuItems = computed(() => {
  const items = [{ label: 'Dashboard', icon: 'pi pi-home', to: '/dashboard' }]
  if (!authed.value) {
    items.push({ label: 'Signup', icon: 'pi pi-user-plus', to: '/signup' })
    items.push({ label: 'Login', icon: 'pi pi-sign-in', to: '/login' })
  }
  return items
})

function logout () {
  clearToken()
  router.replace({ name: 'login' })
}
</script>

<template>
  <div class="min-h-screen text-slate-800 relative">

    <div v-if="needsHeroBg" class="fixed inset-0 -z-10">
      <div class="absolute inset-0 bg-gradient-to-b from-orange-50 via-amber-50 to-white"></div>
      <div class="pointer-events-none absolute right-[8%] top-24 w-[760px] h-[760px] rounded-full
                  bg-gradient-to-br from-orange-400 via-rose-400 to-pink-500 opacity-40 blur-3xl"></div>
      <div class="pointer-events-none absolute left-[12%] bottom-20 w-[360px] h-[360px] rounded-full
                  bg-gradient-to-br from-amber-300 to-orange-400 opacity-40 blur-2xl"></div>
    </div>

    <div v-if="!hideMenubar" class="max-w-5xl mx-auto px-3">
      <Menubar :model="menuItems" class="border-none shadow rounded-xl mt-3 mb-4 bg-white/70 backdrop-blur">
        <template #start><span class="font-semibold ml-1">Auth Demo</span></template>
        <template #end>
          <Button v-if="authed" label="Log out" icon="pi pi-sign-out" @click="logout" />
        </template>
      </Menubar>
    </div>

    <main :class="isFullWidth ? '' : 'max-w-5xl mx-auto px-3'">
      <RouterView :key="route.fullPath" />
    </main>
  </div>
</template>
