import { createApp } from 'vue'
import App from './App.vue'
import router from '../src/rotuer/index'
import './style.css'
import { createPinia } from 'pinia'

createApp(App).use(router).use(createPinia()).mount('#app')
