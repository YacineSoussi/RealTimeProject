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
			<textarea id="message" v-model="message"></textarea>
		</div>
		<button :disabled="message.length === 0" type="submit">Créer</button>
	</form>
</template>

<style scoped>
textarea {
	border: 1px solid;
}

button {
	padding: 5px;
	border-radius: 2px;
	border: 1px solid;
	color: black;
	margin-top: 10px;
	cursor: pointer;
	background-color: #f2f2f2;
	width: 100px;
}

button:hover {
	opacity: 0.8;
}
</style>
