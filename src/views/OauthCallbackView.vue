<script setup>
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { setToken } from '@/services/auth'

const route = useRoute()
const router = useRouter()

onMounted(() => {
  const token = String(route.query.token || '')
  if (token) {
    setToken(token)
    router.replace({ name: 'dashboard' })
  } else {
    router.replace({ name: 'login' })
  }
})
</script>

<template>
  <div class="max-w-md mx-auto p-6 text-slate-500">Signing you in…</div>
</template>
