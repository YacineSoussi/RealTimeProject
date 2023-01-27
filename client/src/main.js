import "./index.css";

import {
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
import { library } from "@fortawesome/fontawesome-svg-core";
import router from "./router";

library.add(
	faEye,
	faRobot,
	faRightFromBracket,
	faPaperPlane,
	faXmark,
	faUsers,
	faMessage,
	faPenToSquare,
	faTrash,
	faCirclePlus
);

const app = createApp(App).component("font-awesome-icon", FontAwesomeIcon);

app.use(router);

app.mount("#app");
