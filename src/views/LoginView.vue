<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'
import { setToken } from '@/services/auth'

const router = useRouter()
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

async function onSubmit() {
  error.value = ''
  loading.value = true
  try {
    const res = await api.login({ email: email.value, password: password.value })
    setToken(res.token)
    router.push({ name: 'dashboard' })
  } catch (e) {
    error.value = e.message || 'Login failed'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="max-w-md mx-auto">
    <h2 class="text-2xl font-bold mb-4">Log In</h2>

    <form @submit.prevent="onSubmit" class="space-y-4 bg-white p-6 rounded-xl shadow">
      <div>
        <label class="block text-sm mb-1">Email</label>
        <input
          v-model="email"
          type="email"
          required
          class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring"
        />
      </div>
      <div>
        <label class="block text-sm mb-1">Password</label>
        <input
          v-model="password"
          type="password"
          required
          class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring"
        />
      </div>

      <p v-if="error" class="text-sm text-rose-600">{{ error }}</p>

      <button
        :disabled="loading"
        class="w-full rounded-lg px-4 py-2 bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50"
      >
        {{ loading ? 'Logging in...' : 'Log In' }}
      </button>

      <p class="text-sm text-slate-500">
        Don’t have an account?
        <RouterLink to="/signup" class="text-slate-900 hover:underline">Sign Up</RouterLink>
      </p>
    </form>
  </div>
</template>
