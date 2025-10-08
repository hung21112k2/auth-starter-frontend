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

const showPwd = ref(false)
const showPwd2 = ref(false)

const showRules = ref(false)
const clearRules = () => { showRules.value = false }

// Rules
const lenOK = computed(() => password.value.length >= 8)
const hasUpper = computed(() => /[A-Z]/.test(password.value))
const hasSpecial = computed(() => /[^A-Za-z0-9]/.test(password.value))
const confirmOK = computed(() => confirmPassword.value !== '' && confirmPassword.value === password.value)
const rulesInvalid = computed(() => !lenOK.value || !hasUpper.value || !hasSpecial.value)
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
  
    msg.value = `Sign-up successful! We sent a verification email to ${email.value}.`
    router.push({ name: 'verify-sent', query: { email: email.value } })
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
          @input="clearRules"
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
          @input="clearRules"
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
          @input="clearRules"
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

      <!-- Password (with eye) -->
      <div>
        <label class="block text-sm mb-1">Password</label>
        <div class="relative">
          <input
            v-model="password"
            @input="clearRules"
            :type="showPwd ? 'text' : 'password'"
            required
            autocomplete="new-password"
            :class="[
              'w-full border rounded-lg px-3 py-2 pr-11 focus:outline-none focus:ring',
              showRules && (!lenOK || !hasUpper || !hasSpecial) ? 'border-rose-500' : ''
            ]"
          />
          <button
            type="button"
            class="absolute inset-y-0 right-0 px-3 flex items-center text-slate-500 hover:text-slate-700"
            :aria-pressed="showPwd"
            title="Show/Hide password"
            @click="showPwd = !showPwd"
          >
            <svg v-if="!showPwd" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 3l18 18"/>
              <path d="M9.9 4.2A10.9 10.9 0 0 1 12 4c6.5 0 10 7 10 7a17.4 17.4 0 0 1-3.2 4.1M6 6A16.5 16.5 0 0 0 2 11s3.5 7 10 7a10.7 10.7 0 0 0 3.1-.4"/>
            </svg>
            <span class="sr-only">Toggle password</span>
          </button>
        </div>
      </div>

      <!-- Confirm Password (with eye) -->
      <div>
        <label class="block text-sm mb-1">Confirm password</label>
        <div class="relative">
          <input
            v-model="confirmPassword"
            @input="clearRules"
            :type="showPwd2 ? 'text' : 'password'"
            required
            autocomplete="new-password"
            :class="[
              'w-full border rounded-lg px-3 py-2 pr-11 focus:outline-none focus:ring',
              showRules && !confirmOK ? 'border-rose-500' : ''
            ]"
          />
          <button
            type="button"
            class="absolute inset-y-0 right-0 px-3 flex items-center text-slate-500 hover:text-slate-700"
            :aria-pressed="showPwd2"
            title="Show/Hide confirm password"
            @click="showPwd2 = !showPwd2"
          >
            <svg v-if="!showPwd2" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 3l18 18"/>
              <path d="M9.9 4.2A10.9 10.9 0 0 1 12 4c6.5 0 10 7 10 7a17.4 17.4 0 0 1-3.2 4.1M6 6A16.5 16.5 0 0 0 2 11s3.5 7 10 7a10.7 10.7 0 0 0 3.1-.4"/>
            </svg>
            <span class="sr-only">Toggle confirm password</span>
          </button>
        </div>
      </div>

      <!-- Rules box (only after failed submit) -->
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

      <p v-if="msg" class="text-sm text-emerald-600">{{ msg }}</p>
      <p v-if="error" class="text-sm text-rose-600">{{ error }}</p>

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
