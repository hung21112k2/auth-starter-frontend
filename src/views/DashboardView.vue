<script setup>
import { onMounted, ref } from 'vue'
import api from '@/services/api'
import { clearToken } from '@/services/auth'
import { useRouter } from 'vue-router'

const router = useRouter()
const me = ref(null)
const loading = ref(true)
const error = ref('')

async function load() {
  loading.value = true
  error.value = ''
  try {
    me.value = await api.me()
  } catch (e) {
    error.value = e.message || 'Failed to load'
  } finally {
    loading.value = false
  }
}

function logout() {
  clearToken()
  router.push({ name: 'login' })
}

onMounted(load)
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold">Dashboard</h2>
      <button @click="logout" class="px-3 py-1.5 rounded-lg border hover:bg-slate-100">
        Log out
      </button>
    </div>

    <div v-if="loading" class="text-slate-500">Loading...</div>
    <div v-else-if="error" class="text-rose-600">{{ error }}</div>

    <div v-else class="grid gap-4 sm:grid-cols-3">
      <!-- User ID -->
      <div class="bg-white p-4 rounded-xl shadow">
        <p class="text-xs text-slate-500">User ID</p>
        <p class="mt-1 text-xl font-semibold">{{ me.id }}</p>
      </div>

      <!-- Email: wider (span 2 columns) + no wrap + horizontal scroll if still long -->
      <div class="bg-white p-4 rounded-xl shadow sm:col-span-2 min-w-0">
        <p class="text-xs text-slate-500">Email</p>
        <p
          class="mt-1 text-xl font-semibold whitespace-nowrap overflow-x-auto no-scrollbar"
          :title="me.email"
        >
          {{ me.email }}
        </p>
      </div>

      <!-- Full name -->
      <div class="bg-white p-4 rounded-xl shadow">
        <p class="text-xs text-slate-500">Full name</p>
        <p class="mt-1 text-xl font-semibold">{{ me.full_name }}</p>
      </div>
    </div>
  </div>
</template>

<style>
/* Hide scrollbar for aesthetics, still scrollable (browser-dependent) */
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>
