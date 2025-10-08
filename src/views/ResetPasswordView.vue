<!-- src/views/ResetPasswordView.vue -->
<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/services/api'
import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline'

const route = useRoute()
const router = useRouter()
const token = String(route.query.token || '')

const password = ref('')
const confirm  = ref('')

const show1 = ref(false)
const show2 = ref(false)

const loading = ref(false)
const msg = ref('')
const error = ref('')

// chỉ bật khi ấn submit mà sai
const showRules = ref(false)
const clearRules = () => { showRules.value = false }

const lenOK = computed(() => password.value.length >= 8)
const hasUpper = computed(() => /[A-Z]/.test(password.value))
const hasSpecial = computed(() => /[^A-Za-z0-9]/.test(password.value))
const matchOK = computed(() => confirm.value !== '' && confirm.value === password.value)
const rulesInvalid = computed(() => !lenOK.value || !hasUpper.value || !hasSpecial.value)

async function submit () {
  error.value = ''; msg.value = ''
  if (!token) { error.value = 'Missing token.'; return }

  // nếu vi phạm rule hoặc confirm sai -> hiện khối quy tắc & dừng
  if (rulesInvalid.value || !matchOK.value) {
    showRules.value = true
    return
  }

  loading.value = true
  try {
    await api.resetPassword({ token, password: password.value })
    msg.value = 'Password updated. You can now log in.'
    setTimeout(() => router.push({ name: 'login' }), 700)
  } catch (e) {
    error.value = e.message || 'Reset failed.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="max-w-md mx-auto space-y-4">
    <h2 class="text-2xl font-bold">Reset password</h2>

    <!-- New password -->
    <div>
      <label class="block text-sm mb-1">New password</label>
      <div class="relative">
        <input
          :type="show1 ? 'text' : 'password'"
          v-model="password"
          @input="clearRules"
          autocomplete="new-password"
          :class="[
            'w-full border rounded-lg px-3 py-2 pr-11 focus:outline-none focus:ring',
            showRules && rulesInvalid ? 'border-rose-500' : ''
          ]"
        />
        <button
          type="button"
          class="absolute inset-y-0 right-0 px-3 flex items-center text-slate-600 hover:text-slate-800"
          :aria-pressed="show1"
          :aria-label="show1 ? 'Hide password' : 'Show password'"
          @click="show1 = !show1"
        >
          <EyeIcon v-if="!show1" class="w-5 h-5" />
          <EyeSlashIcon v-else class="w-5 h-5" />
        </button>
      </div>
    </div>

    <!-- Confirm password -->
    <div>
      <label class="block text-sm mb-1">Confirm password</label>
      <div class="relative">
        <input
          :type="show2 ? 'text' : 'password'"
          v-model="confirm"
          @input="clearRules"
          autocomplete="new-password"
          :class="[
            'w-full border rounded-lg px-3 py-2 pr-11 focus:outline-none focus:ring',
            showRules && !matchOK ? 'border-rose-500' : ''
          ]"
        />
        <button
          type="button"
          class="absolute inset-y-0 right-0 px-3 flex items-center text-slate-600 hover:text-slate-800"
          :aria-pressed="show2"
          :aria-label="show2 ? 'Hide confirm password' : 'Show confirm password'"
          @click="show2 = !show2"
        >
          <EyeIcon v-if="!show2" class="w-5 h-5" />
          <EyeSlashIcon v-else class="w-5 h-5" />
        </button>
      </div>
    </div>

    <!-- Khối quy tắc: chỉ hiện sau khi bấm Update mà sai -->
    <div v-if="showRules" class="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm">
      <p class="font-medium text-rose-700">Please fix the following:</p>
      <ul class="mt-2 list-disc pl-5 space-y-1">
        <li :class="lenOK ? 'line-through text-emerald-700' : 'text-rose-700'">≥ 8 characters</li>
        <li :class="hasUpper ? 'line-through text-emerald-700' : 'text-rose-700'">≥ 1 uppercase letter</li>
        <li :class="hasSpecial ? 'line-through text-emerald-700' : 'text-rose-700'">≥ 1 special character</li>
      </ul>
      <p v-if="!matchOK" class="mt-2 text-rose-700">Passwords do not match.</p>
    </div>

    <!-- Messages -->
    <p v-if="msg" class="text-sm text-emerald-600">{{ msg }}</p>
    <p v-if="error" class="text-sm text-rose-600">{{ error }}</p>

    <!-- Submit -->
    <button
      :disabled="loading"
      @click="submit"
      class="w-full rounded-lg px-4 py-2 bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50"
    >
      {{ loading ? 'Updating...' : 'Update password' }}
    </button>
  </div>
</template>
