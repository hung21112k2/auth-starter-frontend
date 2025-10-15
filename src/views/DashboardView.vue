<script setup>
import { onMounted, ref } from 'vue'
import api from '@/services/api'

import Card from 'primevue/card'
import Skeleton from 'primevue/skeleton'
import Message from 'primevue/message'

const me = ref(null)
const loading = ref(true)
const error = ref('')

async function load () {
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

onMounted(load)
</script>

<template>

  <section class="min-h-[calc(100vh-4rem)] flex items-start justify-center pt-6 pb-10">
    <div class="w-full px-4">
      <div class="mx-auto max-w-[920px]">
        <Card class="rounded-2xl border border-slate-100 shadow-2xl">
          <template #content>
            <!-- Loading -->
            <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Skeleton class="h-24" />
              <Skeleton class="h-24" />
              <Skeleton class="h-24 md:col-span-2" />
            </div>

            <!-- Error -->
            <Message v-else-if="error" severity="error" :closable="false">{{ error }}</Message>

            <!-- Content -->
            <div v-else class="grid grid-cols-1 gap-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="rounded-xl border border-slate-200 p-5 bg-white/70">
                  <div class="text-sm text-slate-500">User ID</div>
                  <div class="mt-1 text-lg font-semibold">{{ me.id }}</div>
                </div>

                <div class="rounded-xl border border-slate-200 p-5 bg-white/70">
                  <div class="text-sm text-slate-500">Username</div>
                  <div class="mt-1 text-lg font-semibold break-all">{{ me.username }}</div>
                </div>
              </div>

              <div class="rounded-xl border border-slate-200 p-5 bg-white/70">
                <div class="text-sm text-slate-500">Email</div>
                <div class="mt-1 text-lg font-semibold break-all">{{ me.email }}</div>
              </div>

              <div class="rounded-xl border border-slate-200 p-5 bg-white/70">
                <div class="text-sm text-slate-500">Full name</div>
                <div class="mt-1 text-lg font-semibold">{{ me.full_name }}</div>
              </div>
            </div>
          </template>
        </Card>
      </div>
    </div>
  </section>
</template>
