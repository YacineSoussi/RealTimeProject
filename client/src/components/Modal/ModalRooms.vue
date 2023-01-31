<script setup>
import { inject, defineProps, onMounted } from "vue";

const setIsOpenModal = inject("ProviderSetValueModal");
const props = defineProps({
	rooms: {
		type: Array,
		required: true,
	},
});
const ProviderCheckUserInConversation = inject(
	"ProviderCheckUserInConversation"
);
const ProviderPostParticipant = inject("ProviderPostParticipant");
const ProviderUser = inject("ProviderUser");
const joinRoom = (conversationId) => {
	const body = { conversationId, userId: ProviderUser.id };
	ProviderPostParticipant(body);
};

onMounted(() => document.getElementById("modal-toggle").click());
</script>

<template>
	<div class="modal-container">
		<input id="modal-toggle" type="checkbox" />
		<div class="modal-backdrop">
			<div class="modal-content">
				<div class="modalHeader">
					<h5 class="heading">Rejoindre un salon</h5>
				</div>
				<button class="closeBtn" @click="setIsOpenModal">
					<font-awesome-icon icon="xmark" style="margin-bottom: -3px" />
				</button>
				<div class="modalContent">
					<ul v-if="props.rooms?.length > 0">
						<template v-for="room in props.rooms">
							<li>
								<div class="flex justify-between m-1">
									{{ room.name ? room.name : room.id }} :

									<div
										style="color: seagreen"
										v-if="ProviderCheckUserInConversation(room)"
									>
										Présent(e)
									</div>
									<div
										style="color: red"
										v-else-if="
											room.participants.length >= room.maxParticipants &&
											room.maxParticipants
										"
									>
										Complet
									</div>
									<button v-else class="btn_join" @click="joinRoom(room.id)">
										Rejoindre
									</button>
								</div>
							</li>
						</template>
					</ul>
					<div v-else>
						<p>Aucun salon ouvert</p>
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
