<script setup>
import { ref } from 'vue'
import api from '@/services/api'

const email = ref('')
const sending = ref(false)
const msg = ref('')
const error = ref('')

async function submit() {
  msg.value=''; error.value=''
  if (!email.value) { error.value = 'Enter your email.'; return }
  sending.value = true
  try {
    await api.forgotPassword(email.value)
    msg.value = 'If the email exists, a reset link has been sent.'
  } catch (e) {
    error.value = e.message || 'Failed to send reset link.'
  } finally { sending.value = false }
}
</script>

<template>
  <div class="max-w-md mx-auto space-y-4">
    <h2 class="text-2xl font-bold">Forgot password</h2>
    <p class="text-slate-600">Enter your email to receive a password reset link.</p>

    <label class="block text-sm">Email</label>
    <input v-model="email" type="email" class="w-full border rounded-lg px-3 py-2" placeholder="you@example.com" />
    <button :disabled="sending" @click="submit" class="px-4 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50">
      {{ sending ? 'Sending...' : 'Send reset link' }}
    </button>

    <p v-if="msg" class="text-sm text-emerald-600">{{ msg }}</p>
    <p v-if="error" class="text-sm text-rose-600">{{ error }}</p>
  </div>
</template>
