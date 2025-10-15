<script setup>
import { ref, computed } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import api from '@/services/api'

import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import Message from 'primevue/message'
import InputGroup from 'primevue/inputgroup'
import InputGroupAddon from 'primevue/inputgroupaddon'

const router = useRouter()

const fullName = ref('')
const email = ref('')
const username = ref('')
const password = ref('')
const confirmPassword = ref('')

const loading = ref(false)
const msg = ref('')
const error = ref('')

// rules
const lenOK = computed(() => password.value.length >= 8)
const hasUpper = computed(() => /[A-Z]/.test(password.value))
const hasSpecial = computed(() => /[^A-Za-z0-9]/.test(password.value))
const confirmOK = computed(() => confirmPassword.value !== '' && confirmPassword.value === password.value)
const usernameOK = computed(() => /^[A-Za-z0-9_]{3,50}$/.test(username.value || ''))
const rulesInvalid = computed(() => !lenOK.value || !hasUpper.value || !hasSpecial.value)

async function onSubmit () {
  msg.value = ''
  error.value = ''

  if (!usernameOK.value || rulesInvalid.value || !confirmOK.value) {
    error.value = 'Please fix validation issues below.'
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

    localStorage.removeItem('auth.email_verified')
    msg.value = `Sign-up successful! We sent a verification email to ${email.value}.`
    router.push({ name: 'verify-sent', query: { email: email.value } })
  } catch (e) {
    error.value = e.message || 'Sign-up failed'
  } finally {
    loading.value = false
  }
}

// Reuse password PT & classes to keep both fields perfectly identical
const pwPt = {
  root: { class: 'w-full' },
  showIcon: { class: 'text-slate-500' },
  hideIcon: { class: 'text-slate-500' },
}
const pwInputClass =
  '!w-full !bg-white/60 !border-0 focus:!ring-0 focus:!shadow-none'
</script>

<template>
  <section
    class="relative min-h-screen overflow-hidden flex items-start justify-center pt-24
           bg-gradient-to-b from-orange-50 via-amber-50 to-white"
  >
    <div
      class="pointer-events-none absolute right-[8%] top-24 w-[760px] h-[760px] rounded-full
             bg-gradient-to-br from-orange-400 via-rose-400 to-pink-500 opacity-40 blur-3xl"
    />
    <div
      class="pointer-events-none absolute left-[12%] bottom-20 w-[360px] h-[360px] rounded-full
             bg-gradient-to-br from-amber-300 to-orange-400 opacity-40 blur-2xl"
    />

    <div class="w-full px-4">
      <h1
        class="text-center text-[34px] md:text-[40px] font-extrabold tracking-tight text-slate-800 mb-6"
      >
        Sign Up
      </h1>

      <div class="mx-auto max-w-[560px]">
        <Card class="rounded-2xl border border-slate-100 shadow-2xl">
          <template #content>
            <form @submit.prevent="onSubmit" class="flex flex-col gap-4 text-left">
              <!-- Full name -->
              <div>
                <label class="block text-sm text-slate-500 mb-1">Full name</label>
                <InputGroup
                  class="rounded-xl overflow-hidden ring-1 ring-slate-200 focus-within:ring-emerald-500 transition"
                >
                  <InputGroupAddon><i class="pi pi-id-card" /></InputGroupAddon>
                  <InputText
                    v-model.trim="fullName"
                    class="w-full"
                    autocomplete="name"
                    placeholder="Your full name"
                  />
                </InputGroup>
              </div>

              <!-- Email -->
              <div>
                <label class="block text-sm text-slate-500 mb-1">Email</label>
                <InputGroup
                  class="rounded-xl overflow-hidden ring-1 ring-slate-200 focus-within:ring-emerald-500 transition"
                >
                  <InputGroupAddon><i class="pi pi-envelope" /></InputGroupAddon>
                  <InputText
                    v-model.trim="email"
                    type="email"
                    class="w-full"
                    autocomplete="email"
                    placeholder="you@example.com"
                  />
                </InputGroup>
              </div>

              <!-- Username -->
              <div>
                <label class="block text-sm text-slate-500 mb-1">Username</label>
                <InputGroup
                  class="rounded-xl overflow-hidden ring-1 ring-slate-200 focus-within:ring-emerald-500 transition"
                >
                  <InputGroupAddon><i class="pi pi-user" /></InputGroupAddon>
                  <InputText
                    v-model.trim="username"
                    class="w-full"
                    autocomplete="username"
                    placeholder="Username"
                  />
                </InputGroup>
                <small class="text-slate-500">3–50 chars, letters/numbers/_ only</small>
              </div>

              <!-- Password + Confirm -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm text-slate-500 mb-1">Password</label>
                  <InputGroup
                    class="rounded-xl overflow-hidden ring-1 ring-slate-200 focus-within:ring-emerald-500 transition"
                  >
                    <InputGroupAddon><i class="pi pi-lock" /></InputGroupAddon>
                    <Password
                      v-model="password"
                      :toggleMask="true"
                      :feedback="false"
                      autocomplete="new-password"
                      placeholder="Password"
                      :pt="pwPt"
                      :inputClass="pwInputClass"
                      class="w-full"
                    />
                  </InputGroup>
                </div>

                <div>
                  <label class="block text-sm text-slate-500 mb-1">Confirm password</label>
                  <InputGroup
                    class="rounded-xl overflow-hidden ring-1 ring-slate-200 focus-within:ring-emerald-500 transition"
                  >
                    <InputGroupAddon><i class="pi pi-lock" /></InputGroupAddon>
                    <Password
                      v-model="confirmPassword"
                      :toggleMask="true"
                      :feedback="false"
                      autocomplete="new-password"
                      placeholder="Repeat password"
                      :pt="pwPt"
                      :inputClass="pwInputClass"
                      class="w-full"
                    />
                  </InputGroup>
                </div>
              </div>

              <!-- Rules -->
              <ul class="m-0 pl-5 text-[13px] text-slate-600 list-disc space-y-1">
                <li :class="lenOK ? 'text-green-600' : 'text-slate-600'">Password ≥ 8 characters</li>
                <li :class="hasUpper ? 'text-green-600' : 'text-slate-600'">At least 1 uppercase letter</li>
                <li :class="hasSpecial ? 'text-green-600' : 'text-slate-600'">At least 1 special character</li>
                <li :class="confirmOK ? 'text-green-600' : 'text-slate-600'">Passwords match</li>
                <li :class="usernameOK ? 'text-green-600' : 'text-slate-600'">Valid username</li>
              </ul>

              <Message v-if="error" severity="error" :closable="false">{{ error }}</Message>
              <Message v-if="msg" severity="success" :closable="false">{{ msg }}</Message>

              <Button
                type="submit"
                :loading="loading"
                label="Sign up"
                icon="pi pi-user-plus"
                class="w-full h-12 rounded-full font-semibold !border-0
                       bg-gradient-to-r from-emerald-600 to-emerald-500 text-white
                       hover:from-emerald-700 hover:to-emerald-600 shadow-md"
              />

              <div class="text-center text-sm text-slate-600">
                Already have an account?
                <RouterLink to="/login" class="text-primary hover:underline">Log in</RouterLink>
              </div>
            </form>
          </template>
        </Card>
      </div>
    </div>
  </section>
</template>
