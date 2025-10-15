<script setup>
import { useRouter } from 'vue-router'
import Card from 'primevue/card'
import Button from 'primevue/button'
const router = useRouter()
</script>

<template>
  <section class="relative min-h-screen overflow-hidden flex items-start justify-center pt-24
                  bg-gradient-to-b from-orange-50 via-amber-50 to-white">
    <div class="pointer-events-none absolute right-[8%] top-24 w-[760px] h-[760px] rounded-full
                bg-gradient-to-br from-orange-400 via-rose-400 to-pink-500 opacity-40 blur-3xl" />
    <div class="pointer-events-none absolute left-[12%] bottom-20 w-[360px] h-[360px] rounded-full
                bg-gradient-to-br from-amber-300 to-orange-400 opacity-40 blur-2xl" />

    <div class="mx-auto px-4 w-full max-w-[560px] relative">
      <Card class="rounded-2xl shadow-2xl border border-slate-100">
        <template #title>Email verified</template>
        <template #content>
          <p class="mb-4 text-slate-700">
            Your email has been verified successfully. You can now log in.
          </p>
          <Button
            label="Go to Login"
            icon="pi pi-sign-in"
            class="w-full h-12 rounded-full font-semibold !border-0
                   bg-gradient-to-r from-emerald-600 to-emerald-500 text-white
                   hover:from-emerald-700 hover:to-emerald-600"
            @click="router.push({ name: 'login' })"
          />
        </template>
      </Card>
    </div>
  </section>
</template>
