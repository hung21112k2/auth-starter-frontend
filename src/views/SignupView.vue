<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'

const router = useRouter()

const fullName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')

const loading = ref(false)
const msg = ref('')
const error = ref('')

// Validate cơ bản
const pwdTooShort = computed(() => password.value && password.value.length < 8)
const pwdNotMatch = computed(
  () => confirmPassword.value && confirmPassword.value !== password.value
)
const formInvalid = computed(() =>
  !fullName.value ||
  !email.value ||
  !password.value ||
  !confirmPassword.value ||
  pwdTooShort.value ||
  pwdNotMatch.value
)

async function onSubmit() {
  if (formInvalid.value) return
  error.value = ''
  msg.value = ''
  loading.value = true
  try {
    await api.signup({
      email: email.value.trim(),
      password: password.value,
      full_name: fullName.value.trim()
    })
    msg.value = 'Sign-up successful! Please log in.'
    setTimeout(() => router.push({ name: 'login' }), 700)
  } catch (e) {
    error.value = e.message || 'Sign-up failed'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="max-w-md mx-auto">
    <h2 class="text-2xl font-bold mb-4">Sign Up</h2>

    <form @submit.prevent="onSubmit" class="space-y-4 bg-white p-6 rounded-xl shadow">
      <!-- Full name -->
      <div>
        <label class="block text-sm mb-1">Full name</label>
        <input
          v-model.trim="fullName"
          type="text"
          required
          autocomplete="name"
          class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring"
        />
      </div>

      <!-- Email -->
      <div>
        <label class="block text-sm mb-1">Email</label>
        <input
          v-model.trim="email"
          type="email"
          required
          autocomplete="email"
          class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring"
        />
      </div>

      <!-- Password -->
      <div>
        <label class="block text-sm mb-1">Password</label>
        <input
          v-model="password"
          type="password"
          required
          autocomplete="new-password"
          class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring"
        />
        <p v-if="pwdTooShort" class="text-xs text-amber-600 mt-1">
          Password must be at least 8 characters.
        </p>
      </div>

      <!-- Confirm Password -->
      <div>
        <label class="block text-sm mb-1">Confirm password</label>
        <input
          v-model="confirmPassword"
          type="password"
          required
          autocomplete="new-password"
          class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring"
        />
        <p v-if="pwdNotMatch" class="text-xs text-rose-600 mt-1">
          Password confirmation does not match.
        </p>
      </div>

      <!-- Messages -->
      <p v-if="msg" class="text-sm text-emerald-600">{{ msg }}</p>
      <p v-if="error" class="text-sm text-rose-600">{{ error }}</p>

      <!-- Submit -->
      <button
        :disabled="loading || formInvalid"
        class="w-full rounded-lg px-4 py-2 bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50"
      >
        {{ loading ? 'Signing up...' : 'Sign up' }}
      </button>

      <p class="text-sm text-slate-500">
        Already have an account?
        <RouterLink to="/login" class="text-slate-900 hover:underline">Log in</RouterLink>
      </p>
    </form>
  </div>
</template>
