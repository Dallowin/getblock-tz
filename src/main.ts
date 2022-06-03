import { createApp } from 'vue'
import axios from "axios"
import VueAxios from "vue-axios"
import store from './store'
import App from './App.vue'
import './assets/index.css'

createApp(App)
    .use(VueAxios, axios)
    .use(store)
    .mount('#app')
