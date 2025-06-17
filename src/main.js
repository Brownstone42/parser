import { createApp } from 'vue'
import router from './router'
import 'bulma/css/bulma.css'
import '@fortawesome/fontawesome-free/css/all.css'

import App from './App.vue'

const app = createApp(App)

app.use(router)

app.mount('#app')