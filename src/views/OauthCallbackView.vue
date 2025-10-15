<script setup>
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { setToken } from '@/services/auth'

import Card from 'primevue/card'
import ProgressSpinner from 'primevue/progressspinner'

const route = useRoute()
const router = useRouter()

onMounted(() => {
  const token = String(route.query.token || '')
  if (token) {
    setToken(token)
    router.replace({ name: 'dashboard' })
  } else {
    router.replace({ name: 'login' })
  }
})
</script>

<template>
  <section class="relative min-h-screen overflow-hidden flex items-start justify-center pt-24
                  bg-gradient-to-b from-orange-50 via-amber-50 to-white">
    <div class="pointer-events-none absolute right-[8%] top-24 w-[760px] h-[760px] rounded-full
                bg-gradient-to-br from-orange-400 via-rose-400 to-pink-500 opacity-40 blur-3xl" />
    <div class="pointer-events-none absolute left-[12%] bottom-20 w-[360px] h-[360px] rounded-full
                bg-gradient-to-br from-amber-300 to-orange-400 opacity-40 blur-2xl" />

    <div class="mx-auto px-4 w-full max-w-[560px]">
      <Card class="rounded-2xl shadow-2xl border border-slate-100 text-center">
        <template #title>Signing you in…</template>
        <template #content>
          <div class="flex items-center justify-center py-4">
            <ProgressSpinner style="width:40px;height:40px" />
          </div>
        </template>
      </Card>
    </div>
  </section>
</template>
