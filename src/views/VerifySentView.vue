<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/services/api'

const route = useRoute()
const router = useRouter()

const email = ref(String(route.query.email || ''))
const sending = ref(false)
const msg = ref('')
const error = ref('')

function redirectIfVerifiedFlag() {
  const v = localStorage.getItem('auth.email_verified')
  if (v) {
    router.replace({ name: 'verify-success' })
  }
}
function onStorage(e) {
  if (e.key === 'auth.email_verified') {
    router.replace({ name: 'verify-success' })
  }
}

async function resend() {
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

onMounted(() => {
  redirectIfVerifiedFlag()
  window.addEventListener('storage', onStorage)
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) redirectIfVerifiedFlag()
  })
})

onBeforeUnmount(() => {
  window.removeEventListener('storage', onStorage)
})
</script>

<template>
  <div class="max-w-md mx-auto space-y-4">
    <h2 class="text-2xl font-bold">Verify your email</h2>

    <p>
      We sent a verification link to
      <span class="font-medium">{{ email }}</span>.
      Please check your inbox and click the link.
    </p>

    <div class="space-y-2">
      <label class="block text-sm">Your email</label>
      <input
        v-model="email"
        type="email"
        class="w-full border rounded-lg px-3 py-2"
        placeholder="you@example.com"
      />
      <button
        :disabled="sending"
        @click="resend"
        class="px-4 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50"
      >
        {{ sending ? 'Resending...' : 'Resend email' }}
      </button>
    </div>

    <p v-if="msg" class="text-emerald-600 text-sm">{{ msg }}</p>
    <p v-if="error" class="text-rose-600 text-sm">{{ error }}</p>
  </div>
</template>
