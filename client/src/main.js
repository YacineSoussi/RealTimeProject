import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './index.css'

// Font awesome
import { library } from "@fortawesome/fontawesome-svg-core";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(faEye);


const app = createApp(App).component("font-awesome-icon", FontAwesomeIcon)

app.use(router)

app.mount('#app')
