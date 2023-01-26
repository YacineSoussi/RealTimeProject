<script setup>
import { inject, defineProps } from "vue";

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
	const body = {
		conversationId,
		userId: ProviderUser.id,
	};

	ProviderPostParticipant(body);
};
</script>

<template>
	<div class="darkBG">
		<div class="centered">
			<div class="modal">
				<div class="modalHeader">
					<h5 class="heading">Rejoindre un salon</h5>
				</div>
				<button class="closeBtn">
					<font-awesome-icon
						icon="xmark"
						style="margin-bottom: -3px"
						@click="setIsOpenModal"
					/>
				</button>
				<div class="modalContent">
					<ul>
						<template v-for="room in props.rooms">
							<li>
								<div class="flex justify-between m-1">
									{{ room.name ? room.name : room.id }} :

									<div
										style="color: seagreen"
										v-if="ProviderCheckUserInConversation(room)"
									>
										présent(e)
									</div>
									<div
										style="color: red"
										v-else-if="
											room.participants.length >= room.maxParticipants &&
											room.maxParticipants
										"
									>
										complet
									</div>
									<button v-else class="btn_join" @click="joinRoom(room.id)">
										Rejoindre
									</button>
								</div>
							</li>
						</template>
					</ul>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.darkBG {
	background-color: rgba(0, 0, 0, 0.2);
	width: 100vw;
	height: 100vh;
	z-index: 1;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	position: absolute;
}

.centered {
	position: fixed;
	z-index: 2;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
}

.modal {
	width: 250px;
	background: white;
	color: white;
	z-index: 10;
	border-radius: 16px;
	box-shadow: 0 5px 20px 0 rgba(0, 0, 0, 0.04);
}

.modalHeader {
	height: 50px;
	background: white;
	overflow: hidden;
	border-top-left-radius: 16px;
	border-top-right-radius: 16px;
}

.heading {
	margin: 0;
	padding: 10px;
	color: #2c3e50;
	font-weight: 500;
	font-size: 18px;
	text-align: center;
}

.modalContent {
	padding: 10px;
	font-size: 14px;
	color: #2c3e50;
	text-align: center;
}

.modalActions {
	position: absolute;
	bottom: 2px;
	margin-bottom: 10px;
	width: 100%;
}

.closeBtn {
	cursor: pointer;
	font-weight: 500;
	padding: 4px 8px;
	border-radius: 8px;
	border: none;
	font-size: 18px;
	color: #2c3e50;
	background: white;
	transition: all 0.25s ease;
	box-shadow: 0 5px 20px 0 rgba(0, 0, 0, 0.06);
	position: absolute;
	right: 0;
	top: 0;
	align-self: flex-end;
	margin-top: -7px;
	margin-right: -7px;
}

.closeBtn:hover {
	box-shadow: 0 5px 20px 0 rgba(0, 0, 0, 0.04);
	transform: translate(-4px, 4px);
}

.btn_join {
	cursor: pointer;
	border-radius: 15px;
	font-size: 0.8rem;
	padding: 5px 10px;
	border: none;
	color: white;
	background: #185adb;
	transition: all 0.25s ease;
}
</style>
