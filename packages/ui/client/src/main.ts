import { createApp } from 'vue'
import App from './App.vue'
import router from './router';
import PrimeVue from 'primevue/config';
import 'primeicons/primeicons.css';
import 'primevue/resources/themes/tailwind-light/theme.css';
import 'primevue/resources/primevue.min.css';
import './assets/index.css';

const app = createApp(App);

app.use(router).use(PrimeVue).mount('#app');
