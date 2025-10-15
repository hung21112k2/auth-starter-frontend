<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/services/api'

import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Message from 'primevue/message'
import FloatLabel from 'primevue/floatlabel'

const route = useRoute()
const router = useRouter()

const email = ref(String(route.query.email || ''))
const sending = ref(false)
const msg = ref('')
const error = ref('')

let bc = null
let pollStorage = null
let pollServer = null

function toSuccess () {
  try { localStorage.removeItem('auth.email_verified') } catch {}
  if (pollStorage) { clearInterval(pollStorage); pollStorage = null }
  if (pollServer) { clearInterval(pollServer); pollServer = null }
  if (bc) { try { bc.close() } catch {} bc = null }
  router.replace({ name: 'verify-success' })
}

function onStorage (e) {
  if (e.key === 'auth.email_verified' && e.newValue) toSuccess()
}
function onVisibilityChange () {
  if (!document.hidden && localStorage.getItem('auth.email_verified')) toSuccess()
}

async function resend () {
  error.value = ''
  msg.value = ''
  if (!email.value) { error.value = 'Email is empty.'; return }
  sending.value = true
  try {
    await api.resendVerify(email.value)
    msg.value = 'Verification email resent. Please check your inbox.'
  } catch (e) {
    error.value = e.message || 'Failed to resend verification email.'
  } finally {
    sending.value = false
  }
}

async function checkServerOnce () {
  if (!email.value || typeof api.checkVerified !== 'function') return
  try {
    const res = await api.checkVerified(email.value)
    if (res?.is_verified) toSuccess()
  } catch { /* ignore */ }
}

onMounted(() => {
  try { localStorage.removeItem('auth.email_verified') } catch {}

  try {
    bc = new BroadcastChannel('email-verify')
    bc.onmessage = (ev) => { if (ev?.data?.type === 'verified') toSuccess() }
  } catch {}

  window.addEventListener('storage', onStorage)
  document.addEventListener('visibilitychange', onVisibilityChange)
  window.addEventListener('focus', onVisibilityChange)

  pollStorage = setInterval(() => {
    if (localStorage.getItem('auth.email_verified')) toSuccess()
  }, 1000)

  pollServer = setInterval(checkServerOnce, 3000)
  checkServerOnce()
})

onBeforeUnmount(() => {
  window.removeEventListener('storage', onStorage)
  document.removeEventListener('visibilitychange', onVisibilityChange)
  window.removeEventListener('focus', onVisibilityChange)
  if (pollStorage) clearInterval(pollStorage)
  if (pollServer) clearInterval(pollServer)
  if (bc) { try { bc.close() } catch {} }
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
        <template #title>Verify your email</template>
        <template #content>
          <p class="mb-3">
            We sent a verification link to <b>{{ email }}</b>. Please check your inbox and click the link.
          </p>

          <div class="space-y-3">
            <FloatLabel>
              <InputText id="email" v-model="email" class="w-full" />
              <label for="email">Your email</label>
            </FloatLabel>
            <Button :loading="sending" label="Resend email" icon="pi pi-send" class="rounded-full" @click="resend" />
          </div>

          <Message v-if="msg" class="mt-3" severity="success" :closable="false">{{ msg }}</Message>
          <Message v-if="error" class="mt-2" severity="error" :closable="false">{{ error }}</Message>
        </template>
      </Card>
    </div>
  </section>
</template>
