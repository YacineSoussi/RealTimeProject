import "./index.css";

import {
	faCheck,
	faCirclePlus,
	faEye,
	faMessage,
	faPaperPlane,
	faPenToSquare,
	faRightFromBracket,
	faRobot,
	faTrash,
	faUsers,
	faXmark,
} from "@fortawesome/free-solid-svg-icons";

import App from "./App.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { createApp } from "vue";
import { createPinia } from "pinia";
import { library } from "@fortawesome/fontawesome-svg-core";
import router from "./router";

library.add(
	faEye,
	faRightFromBracket,
	faPaperPlane,
	faXmark,
	faRobot,
	faUsers,
	faMessage,
	faPenToSquare,
	faTrash,
	faCirclePlus,
	faCheck
);

const app = createApp(App).component("font-awesome-icon", FontAwesomeIcon);

app.use(router);
app.use(createPinia());
app.mount("#app");
