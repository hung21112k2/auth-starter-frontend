<template>
  <div class="min-h-screen bg-slate-50 text-slate-800">
    <header class="border-b bg-white">
      <div class="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <h1 class="font-semibold">Auth Demo</h1>
        <nav class="flex gap-3 text-sm">
          <RouterLink class="hover:underline" to="/login">Login</RouterLink>
          <RouterLink class="hover:underline" to="/signup">Signup</RouterLink>
          <RouterLink class="hover:underline" to="/dashboard">Dashboard</RouterLink>
        </nav>
      </div>
    </header>
    <main class="max-w-4xl mx-auto px-4 py-8">
      <RouterView />
    </main>
  </div>
</template>
