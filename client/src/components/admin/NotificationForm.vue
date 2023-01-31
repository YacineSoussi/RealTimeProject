<script setup>
import { ref } from "vue";
import NotificationLogic from "../../logics/NotificationLogic.js";
import { createToast } from "mosha-vue-toastify";

const message = ref("");
const onSubmit = async () => {
	const body = {
		message: message.value,
	};

	try {
		await NotificationLogic.createNotification(body);
		message.value = "";
	} catch (error) {
		createToast(error.response.data.message, {
			type: "error",
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
};
</script>

<template>
	<form @submit.prevent="onSubmit">
		<div class="flex flex-col">
			<label for="message">Message</label>
			<input type="text" id="message" v-model="message" />
		</div>
		<button :disabled="message.length === 0" type="submit">Créer</button>
	</form>
</template>
