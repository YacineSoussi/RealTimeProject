<script setup>
import { onMounted } from "vue";
import HeaderVue from "./components/partials/Header.vue";
import { createToast } from "mosha-vue-toastify";
import "mosha-vue-toastify/dist/style.css";
import Footer from "./Footer.vue";

onMounted(async () => {
	new EventSource("http://localhost:3000/notifications").addEventListener(
		"notification",
		(event) => {
			createToast(event.data.replace(/['"]+/g, ""), {
				type: "success",
				position: "top-right",
				timeout: 8000,
				dismissible: true,
				pauseOnFocusLoss: true,
				pauseOnHover: true,
				draggable: true,
				draggablePercent: 0.6,
				showCloseButtonOnHover: false,
				hideProgressBar: false,
				closeButton: "button",
				icon: true,
				rtl: false,
			});
		}
	);
});
</script>

<template>
	<HeaderVue />
	<Footer></Footer>
</template>
