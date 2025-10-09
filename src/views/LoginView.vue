<script setup>
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import api from '@/services/api'
import { setToken } from '@/services/auth'

const router = useRouter()
const identifier = ref('')
const password = ref('')
const showPwd = ref(false)
const loading = ref(false)
const error = ref('')

async function onSubmit () {
  error.value = ''
  if (!identifier.value.trim() || !password.value) {
    error.value = 'Please enter email/username and password.'
    return
  }
  loading.value = true
  try {
    const res = await api.login({ email: identifier.value.trim(), password: password.value })
    setToken(res.token)
    router.push({ name: 'dashboard' })
  } catch (e) {
    if (String(e.message).toLowerCase().includes('not verified')) {
      error.value = 'Email not verified. Check your inbox or click “Resend” on the Verify page.'
    } else {
      error.value = e.message || 'Login failed'
    }
  } finally { loading.value = false }
}
</script>

<template>
  <div class="max-w-md mx-auto">
    <h2 class="text-2xl font-bold mb-4">Log In</h2>

    <form @submit.prevent="onSubmit" class="space-y-4 bg-white p-6 rounded-xl shadow">
      <div>
        <label class="block text-sm mb-1">Email or Username</label>
        <input
          v-model.trim="identifier"
          type="text"
          required
          autocomplete="username"
          class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring"
        />
      </div>

      <div>
        <label class="block text-sm mb-1">Password</label>
        <div class="relative">
          <input
            v-model="password"
            :type="showPwd ? 'text' : 'password'"
            required
            autocomplete="current-password"
            class="w-full border rounded-lg px-3 py-2 pr-11 focus:outline-none focus:ring"
          />
          <button
            type="button"
            class="absolute inset-y-0 right-0 px-3 flex items-center text-slate-500 hover:text-slate-700"
            :aria-pressed="showPwd"
            title="Show/Hide password"
            @click="showPwd = !showPwd"
          >
            <svg v-if="!showPwd" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 3l18 18"/><path d="M9.9 4.2A10.9 10.9 0 0 1 12 4c6.5 0 10 7 10 7a17.4 17.4 0 0 1-3.2 4.1M6 6A16.5 16.5 0 0 0 2 11s3.5 7 10 7a10.7 10.7 0 0 0 3.1-.4"/>
            </svg>
            <span class="sr-only">Toggle password</span>
          </button>
        </div>
      </div>

      <p v-if="error" class="text-sm text-rose-600">{{ error }}</p>

      <button :disabled="loading" class="w-full rounded-lg px-4 py-2 bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50">
        {{ loading ? 'Logging in...' : 'Log In' }}
      </button>

      <p class="text-sm text-slate-500">
        Don’t have an account?
        <RouterLink to="/signup" class="text-slate-900 hover:underline">Sign Up</RouterLink>
      </p>
    </form>
  </div>
</template>
