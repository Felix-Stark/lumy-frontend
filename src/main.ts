import './style.css'
import '@fontsource-variable/inter';
import './chart-setup'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import * as Sentry from "@sentry/vue";

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)

Sentry.init({
    app,
    dsn: "https://4a206cdd0bff62ac2fd1677e8e0c5fb7@o4507146348265472.ingest.de.sentry.io/4510061878116432",

    sendDefaultPii: true,

    enableLogs: true,
})

app.mount('#app')

export { pinia }