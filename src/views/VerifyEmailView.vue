<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/services/api'

const route = useRoute()
const router = useRouter()
const token = String(route.query.token || '')

const loading = ref(true)
const msg = ref('')
const error = ref('')

onMounted(async () => {
  if (!token) {
    error.value = 'Missing token.'
    loading.value = false
    return
  }
  try {
    await api.verifyEmail(token)
    // đặt cờ để các tab khác biết đã verify xong
    localStorage.setItem('auth.email_verified', JSON.stringify({ at: Date.now() }))
    msg.value = 'Your email has been verified.'
    // chuyển qua trang success
    setTimeout(() => router.replace({ name: 'verify-success' }), 500)
  } catch (e) {
    error.value = e.message || 'Verification failed.'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="max-w-md mx-auto space-y-4">
    <h2 class="text-2xl font-bold">Email verification</h2>
    <p v-if="loading" class="text-slate-500">Verifying...</p>
    <p v-else-if="msg" class="text-emerald-600">{{ msg }} Redirecting…</p>
    <p v-else-if="error" class="text-rose-600">{{ error }}</p>
  </div>
</template>
