<script setup>
import { ref, inject, onMounted } from "vue";
import CommunicationRequestLogic from "../logics/CommunicationRequestLogic";
import LocalStorage from "../services/LocalStorage";
import { createToast } from "mosha-vue-toastify";
import "mosha-vue-toastify/dist/style.css";

const users = inject("ProviderUsers");
const message = ref("");
const isJoinable = ref(false);
const submitRequest = () => {
	try {
		CommunicationRequestLogic.createCommunicationRequest({
			message: message.value,
			clientId: LocalStorage.get("user").id,
			status: "pending",
		}).then(() => {
			message.value = "";
			createToast("Votre demande a bien été envoyée", {
				type: "success",
				position: "top-right",
				timeout: 3000,
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
		});
	} catch (error) {
		createToast("Une erreur est survenue", {
			type: "error",
			position: "top-right",
			timeout: 3000,
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
		return;
	}
};

onMounted(async () => {
	// If one of the users status is 1, the user is joignable
	users.value.forEach((user) => {
		if (user.status === 1) {
			isJoinable.value = true;
		}
	});
});
</script>

<template>
	<section class="help">
		<h1>Contacter un conseiller de vente</h1>
		<form v-if="isJoinable" @submit.prevent="submitRequest">
			<label>
				Message :
				<textarea v-model="message"></textarea>
			</label>
			<button type="submit">Envoyer la demande</button>
		</form>
		<p v-else>Aucun conseiller de vente n'est joignable pour le moment</p>
	</section>
</template>

<style scoped>
.help {
	margin: 40px 50px 0 50px;
	border: 1px dashed;
	padding: 20px;
}

h1 {
	font-weight: bold;
	font-size: 30px;
	text-align: center;
}

@media (max-width: 630px) {
	h1 {
		font-size: 25px;
	}
}

@media (max-width: 565px) {
	.help {
		margin: 40px 20px 0 20px;
	}
}

@media (max-width: 475px) {
	h1 {
		font-size: 20px;
	}
}

p {
	text-align: center;
	margin-top: 30px;
}

form {
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 80%;
	margin: 0 auto;
	padding: 20px;
}

label {
	margin-bottom: 10px;
}

textarea {
	width: 100%;
	min-height: 100px;
	margin-bottom: 20px;
	padding: 10px;
	font-size: 16px;
	border-radius: 5px;
	border: 1px solid #ccc;
}

button[type="submit"] {
	background-color: #4caf50;
	color: white;
	padding: 12px 20px;
	border: none;
	border-radius: 4px;
	cursor: pointer;
	font-size: 16px;
}

button[type="submit"]:hover {
	background-color: #3e8e41;
}
</style>
