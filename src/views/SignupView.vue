<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'

const router = useRouter()

const fullName = ref('')
const email = ref('')
const username = ref('')
const password = ref('')
const confirmPassword = ref('')

const loading = ref(false)
const msg = ref('')
const error = ref('')

// chỉ bật khi bấm submit mà sai
const showRules = ref(false)
const clearRules = () => { showRules.value = false }

// Password rules: >= 8 ký tự, >= 1 in hoa, >= 1 ký tự đặc biệt
const lenOK = computed(() => password.value.length >= 8)
const hasUpper = computed(() => /[A-Z]/.test(password.value))
const hasSpecial = computed(() => /[^A-Za-z0-9]/.test(password.value))
const confirmOK = computed(() => confirmPassword.value !== '' && confirmPassword.value === password.value)
const rulesInvalid = computed(() => !lenOK.value || !hasUpper.value || !hasSpecial.value)

// Username cơ bản: 3-50 ký tự, chữ/số/underscore, không khoảng trắng
const usernameOK = computed(() => /^[A-Za-z0-9_]{3,50}$/.test(username.value || ''))

async function onSubmit () {
  msg.value = ''
  error.value = ''
  showRules.value = false

  if (!usernameOK.value || rulesInvalid.value || !confirmOK.value) {
    showRules.value = true
    return
  }

  loading.value = true
  try {
    await api.signup({
      email: email.value.trim(),
      username: username.value.trim(),
      password: password.value,
      full_name: fullName.value.trim(),
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

      <!-- Username -->
      <div>
        <label class="block text-sm mb-1">Username</label>
        <input
          v-model.trim="username"
          type="text"
          required
          minlength="3"
          maxlength="50"
          autocomplete="username"
          :class="[
            'w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring',
            showRules && !usernameOK ? 'border-rose-500' : ''
          ]"
        />
      </div>

      <!-- Password -->
      <div>
        <label class="block text-sm mb-1">Password</label>
        <input
          v-model="password"
          @input="clearRules"
          type="password"
          required
          autocomplete="new-password"
          :class="[
            'w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring',
            showRules && (!lenOK || !hasUpper || !hasSpecial) ? 'border-rose-500' : ''
          ]"
        />
      </div>

      <!-- Confirm Password -->
      <div>
        <label class="block text-sm mb-1">Confirm password</label>
        <input
          v-model="confirmPassword"
          @input="clearRules"
          type="password"
          required
          autocomplete="new-password"
          :class="[
            'w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring',
            showRules && !confirmOK ? 'border-rose-500' : ''
          ]"
        />
      </div>

      <!-- Khối quy tắc chỉ hiện khi bấm Sign up mà sai -->
      <div v-if="showRules" class="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm">
        <p class="font-medium text-rose-700">Please fix the following:</p>
        <ul class="mt-2 list-disc pl-5 space-y-1">
          <li :class="usernameOK ? 'line-through text-emerald-700' : 'text-rose-700'">
            Username: 3–50 chars, letters/numbers/_ only
          </li>
          <li :class="lenOK ? 'line-through text-emerald-700' : 'text-rose-700'">
            Password ≥ 8 characters
          </li>
          <li :class="hasUpper ? 'line-through text-emerald-700' : 'text-rose-700'">
            Password has at least 1 uppercase letter
          </li>
          <li :class="hasSpecial ? 'line-through text-emerald-700' : 'text-rose-700'">
            Password has at least 1 special character
          </li>
        </ul>
        <p v-if="!confirmOK" class="mt-2 text-rose-700">
          Password confirmation does not match.
        </p>
      </div>

      <!-- Messages -->
      <p v-if="msg" class="text-sm text-emerald-600">{{ msg }}</p>
      <p v-if="error" class="text-sm text-rose-600">{{ error }}</p>

      <!-- Submit: chỉ disable khi loading -->
      <button
        :disabled="loading"
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
