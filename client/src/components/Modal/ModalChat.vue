<script setup>
import { defineProps, inject, onMounted } from "vue";

const createConversation = inject("ProviderCreateConversation");
const disabledModal = inject("ProviderDisabledModal");
const ProviderCheckIfUserHaveConversationWithOtherUser = inject(
	"ProviderCheckIfUserHaveConversationWithOtherUser"
);
const setIsOpenModalChat = inject("ProviderSetValueModalChat");
const User = inject("ProviderUser");

const props = defineProps({
	users: {
		type: Array,
		required: true,
	},
});

const startChat = (secondUserId) => {
	const body = {
		secondUserId,
		firstUserId: User.id,
	};

	try {
		createConversation(body);
	} catch (error) {
		console.log(error);
	}
};

onMounted(() => {
	disabledModal();
	document.getElementById("modal-toggle").click();
});

function closeModal() {
	disabledModal();
	setIsOpenModalChat();
}
</script>

<template>
	<div class="modal-container">
		<input id="modal-toggle" type="checkbox" />
		<div class="modal-backdrop">
			<div class="modal-content">
				<div class="modalHeader">
					<h5 class="heading">Contacter un client</h5>
				</div>
				<button class="closeBtn" @click="closeModal">
					<font-awesome-icon icon="xmark" style="margin-bottom: -3px" />
				</button>
				<div class="modalContent">
					<ul v-if="props.users?.length > 0">
						<template v-for="user in props.users">
							<li>
								<div class="flex justify-between m-1 mb-2">
									{{ user.firstName }} {{ user.lastName }} :
									<button
										v-if="
											!ProviderCheckIfUserHaveConversationWithOtherUser(user.id)
										"
										class="btn_join"
										@click="startChat(user.id)"
									>
										Contacter
									</button>
									<div v-else style="color: seagreen">Déjà en contact</div>
								</div>
							</li>
						</template>
					</ul>
					<div v-else>
						<p>Aucun client disponible</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.modal-container {
	position: absolute;
}

.btn_join {
	font-size: 14px;
}

.modal-container button:not(.btn_join) {
	display: block;
	margin: 0 auto;
	width: 30px;
	height: 30px;
	line-height: 15px;
	font-size: 22px;
	border: 0;
	border-radius: 3px;
	transition: background 0.3s ease-in;
}

.modal-container .modal-backdrop {
	height: 0;
	width: 0;
	opacity: 0;
	overflow: hidden;
	transition: opacity 0.2s ease-in;
}

.modal-container #modal-toggle {
	position: absolute;
	left: 0;
	top: 0;
	height: 100%;
	width: 100%;
	margin: 0;
	opacity: 0;
	cursor: pointer;
}

.modal-container #modal-toggle:hover ~ button {
	background: #1e824c;
}

.mb-2 {
	margin-bottom: 10px;
}

.modal-container #modal-toggle:checked {
	width: 100vw;
	height: 100vh;
	position: fixed;
	left: 0;
	top: 0;
	z-index: 9;
	opacity: 0;
}

.modal-container #modal-toggle:checked ~ .modal-backdrop {
	background-color: rgba(0, 0, 0, 0.6);
	width: 100vw;
	height: 100vh;
	position: fixed;
	left: 0;
	top: 0;
	z-index: 9;
	pointer-events: none;
	opacity: 1;
}

.modal-container #modal-toggle:checked ~ .modal-backdrop .modal-content {
	background-color: #fff;
	max-width: 400px;
	width: 100%;
	height: 280px;
	padding: 10px 30px;
	position: absolute;
	left: calc(50% - 200px);
	top: 12%;
	border-radius: 4px;
	z-index: 999;
	pointer-events: auto;
	cursor: auto;
}

.modalHeader {
	height: 50px;
	background: white;
	overflow: hidden;
	border-top-left-radius: 16px;
	border-top-right-radius: 16px;
}

.heading {
	font-weight: bold;
	font-size: 18px;
	text-align: center;
}

.modalContent {
	padding: 10px;
	font-size: 14px;
	color: #2c3e50;
	text-align: center;
}

.closeBtn {
	cursor: pointer;
	font-weight: 500;
	padding: 4px 8px;
	border-radius: 8px;
	border: none;
	font-size: 18px;
	color: black;
	transition: all 0.25s ease;
	position: absolute;
	right: 0;
	top: 0;
	align-self: flex-end;
	margin-top: -7px;
	margin-right: -7px;
}

.modal-container
	#modal-toggle:checked
	~ .modal-backdrop
	.modal-content
	.modal-close.button:hover {
	color: #fff;
	background: #1e824c;
}

.modal-container
	#modal-toggle:checked
	~ .modal-backdrop
	.modal-content
	.modal-close:hover {
	color: #333;
}
</style>
