<script setup>
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import api from '@/services/api'
import { setToken } from '@/services/auth'

import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import Divider from 'primevue/divider'
import Message from 'primevue/message'
import Toast from 'primevue/toast'
import InputGroup from 'primevue/inputgroup'
import InputGroupAddon from 'primevue/inputgroupaddon'
import { useToast } from 'primevue/usetoast'

const router = useRouter()
const identifier = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')
const toast = useToast()

function loginWith (provider) {
  window.location.href = `${import.meta.env.VITE_API_BASE_URL}/oauth/${provider}/login`
}

async function onSubmit () {
  error.value = ''
  if (!identifier.value.trim() || !password.value) {
    error.value = 'Please enter email/username and password.'
    return
  }
  loading.value = true
  try {
    const res = await api.login({ email: identifier.value.trim(), password: password.value })
    setToken(res.token)
    toast.add({ severity: 'success', summary: 'Logged in', life: 1500 })
    router.push({ name: 'dashboard' })
  } catch (e) {
    const msg = String(e?.message || 'Login failed')
    error.value = msg.toLowerCase().includes('not verified')
      ? 'Email not verified. Check your inbox or click “Resend”.'
      : msg
  } finally { loading.value = false }
}
</script>

<template>
  <Toast />

  <section class="relative min-h-screen overflow-hidden flex items-start justify-center pt-24
                  bg-gradient-to-b from-orange-50 via-amber-50 to-white">
    <div class="pointer-events-none absolute right-[8%] top-24 w-[760px] h-[760px] rounded-full
                bg-gradient-to-br from-orange-400 via-rose-400 to-pink-500 opacity-40 blur-3xl" />
    <div class="pointer-events-none absolute left-[12%] bottom-20 w-[360px] h-[360px] rounded-full
                bg-gradient-to-br from-amber-300 to-orange-400 opacity-40 blur-2xl" />

    <div class="w-full px-4">
      <h1 class="text-center text-[34px] md:text-[40px] font-extrabold tracking-tight text-slate-800 mb-6">
        Log In
      </h1>

      <div class="mx-auto max-w-[560px]">
        <Card class="rounded-2xl border border-slate-100 shadow-2xl">
          <template #content>
            <form @submit.prevent="onSubmit" class="flex flex-col gap-4">
              <div>
                <label class="block text-left text-sm text-slate-500 mb-1">Email or Username</label>
                <InputGroup class="rounded-xl overflow-hidden ring-1 ring-slate-200 focus-within:ring-emerald-500 transition">
                  <InputGroupAddon><i class="pi pi-user" /></InputGroupAddon>
                  <InputText v-model.trim="identifier" class="w-full" autocomplete="username" placeholder="Email or Username" />
                </InputGroup>
              </div>

              <div>
                <label class="block text-left text-sm text-slate-500 mb-1">Password</label>
                <InputGroup class="rounded-xl overflow-hidden ring-1 ring-slate-200 focus-within:ring-emerald-500 transition">
                  <InputGroupAddon><i class="pi pi-lock" /></InputGroupAddon>
                  <Password v-model="password" :feedback="false" :toggleMask="true" inputClass="w-full"
                            autocomplete="current-password" placeholder="Password" />
                </InputGroup>
              </div>

              <Message v-if="error" severity="error" :closable="false">{{ error }}</Message>

              <Button
                type="submit"
                :loading="loading"
                label="Log In"
                class="w-full h-12 rounded-full font-semibold !border-0
                       bg-gradient-to-r from-emerald-600 to-emerald-500 text-white
                       hover:from-emerald-700 hover:to-emerald-600 shadow-md"
              />

              <Divider align="center" class="my-1">or</Divider>

              <Button label="Continue with Google" icon="pi pi-google" class="w-full p-button-outlined rounded-full h-11" @click="loginWith('google')" />
              <Button label="Continue with Facebook" icon="pi pi-facebook" class="w-full p-button-outlined rounded-full h-11" @click="loginWith('facebook')" />

              <div class="text-center text-sm text-slate-600">
                Don’t have an account?
                <RouterLink to="/signup" class="text-primary hover:underline">Sign Up</RouterLink>
              </div>
            </form>
          </template>
        </Card>
      </div>
    </div>
  </section>
</template>
