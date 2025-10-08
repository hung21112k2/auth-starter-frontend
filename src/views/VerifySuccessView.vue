<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<template>
  <div class="max-w-md mx-auto space-y-4">
    <h2 class="text-2xl font-bold">Email verified ✅</h2>

    <div class="bg-white p-6 rounded-xl shadow space-y-3">
      <p class="text-slate-700">
        Your email has been verified successfully. You can now log in.
      </p>

      <button
        class="w-full rounded-lg px-4 py-2 bg-slate-900 text-white hover:bg-slate-800"
        @click="router.push({ name: 'login' })"
      >
        Go to Login
      </button>
    </div>
  </div>
</template>
