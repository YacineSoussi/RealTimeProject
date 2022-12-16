import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './index.css'

// Font awesome
import { library } from "@fortawesome/fontawesome-svg-core";
import { faEye, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(faEye, faRightFromBracket);


const app = createApp(App).component("font-awesome-icon", FontAwesomeIcon)

app.use(router)

app.mount('#app')