<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/services/api'

import Card from 'primevue/card'
import Message from 'primevue/message'

const route = useRoute()
const router = useRouter()
const token = String(route.query.token || '')

const loading = ref(true)
const msg = ref('')
const error = ref('')

onMounted(async () => {
  if (!token) { error.value = 'Missing token.'; loading.value = false; return }

  try {
    await api.verifyEmail(token)

    // phát tín hiệu cho tab verify-sent
    try {
      const bc = new BroadcastChannel('email-verify')
      bc.postMessage({ type: 'verified', at: Date.now() })
      bc.close()
    } catch {}

    try { localStorage.setItem('auth.email_verified', JSON.stringify({ at: Date.now() })) } catch {}

    msg.value = 'Your email has been verified. Redirecting…'
    setTimeout(() => router.replace({ name: 'verify-success' }), 600)
  } catch (e) {
    error.value = e.message || 'Verification failed.'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <section class="relative min-h-screen overflow-hidden flex items-start justify-center pt-24
                  bg-gradient-to-b from-orange-50 via-amber-50 to-white">
    <div class="pointer-events-none absolute right-[8%] top-24 w-[760px] h-[760px] rounded-full
                bg-gradient-to-br from-orange-400 via-rose-400 to-pink-500 opacity-40 blur-3xl" />
    <div class="pointer-events-none absolute left-[12%] bottom-20 w-[360px] h-[360px] rounded-full
                bg-gradient-to-br from-amber-300 to-orange-400 opacity-40 blur-2xl" />

    <div class="mx-auto px-4 w-full max-w-[560px]">
      <Card class="rounded-2xl shadow-2xl border border-slate-100">
        <template #title>Email verification</template>
        <template #content>
          <p v-if="loading" class="text-slate-500">Verifying...</p>
          <Message v-else-if="msg" severity="success" :closable="false">{{ msg }}</Message>
          <Message v-else-if="error" severity="error" :closable="false">{{ error }}</Message>
        </template>
      </Card>
    </div>
  </section>
</template>
