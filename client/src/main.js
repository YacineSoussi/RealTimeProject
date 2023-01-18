import "./index.css";

import { library } from "@fortawesome/fontawesome-svg-core";
import {
	faEye,
	faRightFromBracket,
	faPaperPlane,
	faXmark,
	faUsers,
	faMessage,
	faPenToSquare,
	faTrash,
	faCirclePlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { createApp } from "vue";
import { library } from "@fortawesome/fontawesome-svg-core";
import router from "./router";

library.add(
	faEye,
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
