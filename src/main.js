import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// PrimeVue setup
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'

// PrimeVue CSS
import 'primevue/resources/themes/lara-light-blue/theme.css' // theme
import 'primevue/resources/primevue.min.css'                 // core
import 'primeicons/primeicons.css'                           // icons
import 'primeflex/primeflex.css'                            

import './assets/main.css'

const app = createApp(App)
app.use(router)
app.use(PrimeVue, { ripple: true, inputStyle: 'filled' })
app.use(ToastService)
app.mount('#app')

