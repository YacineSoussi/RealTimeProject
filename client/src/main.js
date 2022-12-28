import "./index.css";

import {
	faEye,
	faMessage,
	faPaperPlane,
	faRightFromBracket,
	faRobot,
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
	faRightFromBracket,
	faPaperPlane,
	faXmark,
	faRobot,
	faUsers,
	faMessage
);

const app = createApp(App).component("font-awesome-icon", FontAwesomeIcon);

app.use(router);

app.mount("#app");
