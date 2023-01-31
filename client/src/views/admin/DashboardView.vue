<script setup>
import { ref, onMounted, inject, computed } from "vue";
import { useConversationStore } from "../../stores/ConversationStore";
import RoomCard from "../../components/admin/RoomCard.vue";
import UserLogic from "../../logics/UserLogic";
import LocalStorage from "../../services/LocalStorage";
import CommunicationRequestLogic from "../../logics/CommunicationRequestLogic";
import moment from "moment";
import NotificationForm from "../../components/admin/NotificationForm.vue";

const users = inject("ProviderUsers");
const conversationsStore = useConversationStore();
const rooms = computed(() => conversationsStore.getterRooms);
const isEditing = ref(false);
const current_room = ref(null);
const updateUserStatus = inject("ProviderUpdateUser");
const User = LocalStorage.get("user");
const requestsPending = ref([]);

const changeIsEditing = () => (isEditing.value = !isEditing.value);

const fetchAddRoom = async (room) => {
	await conversationsStore.createRoom(room);
};

const fetchDeleteRoom = async (id) => {
	await conversationsStore.deleteConversation(id);
	rooms.value = rooms.value.filter((r) => r.id !== id);
};

const editRoom = (room) => {
	current_room.value = room;
	isEditing.value = true;
};

const fetchUpdateRoom = async (room, id) => {
	await conversationsStore.updateRoom(room, id).then((result) => {
		rooms.value = rooms.value.map((r) => {
			if (r.id === result.id) {
				return result;
			}
			return r;
		});
	});
};

const onClickAddRoom = () => {
	current_room.value = { name: "", maxParticipants: 0 };
	changeIsEditing();
};

const getRequestsPending = async () => {
	const requests = await CommunicationRequestLogic.getCommunicationRequests();
	requestsPending.value = requests.filter((r) => r.status === "pending");
};

const onClickAcceptRequest = async (id) => {
	await CommunicationRequestLogic.updateCommunicationRequest(id, {
		status: "accepted",
	});

	await UserLogic.updateUser(User.id, { status: 0 }).then(() => {
		changeStatus();
	});

	await getRequestsPending();
};

const onClickRejectRequest = async (id) => {
	await CommunicationRequestLogic.updateCommunicationRequest(id, {
		status: "rejected",
	});
	await getRequestsPending();
};

onMounted(async () => {
	UserLogic.getUsers().then(
		(data) => (users.value = data.filter((u) => u.id !== User.id))
	);

	UserLogic.getUser(User.id).then((data) => {
		me.value = data;
		status.value = data.status;
	});

	await getRequestsPending();
});

const me = ref(null);
const status = ref(null);

const clientStatus = computed(() => {
	if (status.value === 1) {
		updateUserStatus(me.value.id, { status: 1 });
		return "Disponible";
	}

	if (status.value === 0) {
		updateUserStatus(me.value.id, { status: 0 });
		return "Non disponible";
	}
});

const fullName = (id) => {
	const user = users.value.find((u) => u.id === id);
	return user ? user.firstName + " " + user.lastName : "";
};

const changeStatus = () => {
	if (status.value === 1) {
		status.value = 0;
	} else {
		status.value = 1;
	}
};
</script>

<template>
	<section class="dashboard">
		<div class="flex heading">
			<div class="flex flex-col">
				<div class="mb-2">
					<span class="toggle-label">Disponibilité de l'admin :</span>
					<label class="toggle">
						<input
							class="toggle-checkbox"
							type="checkbox"
							@click="changeStatus"
							:checked="status === 1"
						/>
						<div class="toggle-switch"></div>
					</label>
				</div>
				<div>
					<span>Disponibilité pour les clients :</span>
					<span class="ml-3 inline-block">{{ clientStatus }}</span>
				</div>
			</div>
		</div>
		<div class="w-full px-4 md:px-0 md:mt-8 mb-16 text-gray-800 leading-normal">
			<div class="flex flex-wrap">
				<div class="w-full md:w-1/2 xl:w-1/3 p-3">
					<div class="bg-white border rounded shadow p-2">
						<div class="flex flex-row items-center">
							<div class="flex-shrink pr-4">
								<div class="rounded p-3 bg-green-600">
									<i class="fa fa-google-wallet"></i>
								</div>
							</div>
							<div class="flex-1 text-right md:text-center">
								<h5 class="font-bold uppercase color-orange">
									Communications en attente
								</h5>
								<h3 class="font-bold text-3xl">
									{{ requestsPending ? requestsPending.length : 0 }}
									<span class="text-green-500"
										><i class="fa fa-caret-up"></i
									></span>
								</h3>
							</div>
						</div>
					</div>
				</div>
				<div class="w-full md:w-1/2 xl:w-1/3 p-3">
					<div class="bg-white border rounded shadow p-2">
						<div class="flex flex-row items-center">
							<div class="flex-shrink pr-4">
								<div class="rounded p-3 bg-pink-600">
									<i class="fa fa-users"></i>
								</div>
							</div>
							<div class="flex-1 text-right md:text-center">
								<h5 class="font-bold uppercase color-orange">
									Nombre d'utilisateurs
								</h5>
								<h3 class="font-bold text-3xl">
									{{ users ? users.length : null }}
									<span class="text-pink-500"
										><i class="fa fa-exchange-alt"></i
									></span>
								</h3>
							</div>
						</div>
					</div>
				</div>
				<div class="w-full md:w-1/2 xl:w-1/3 p-3">
					<div class="bg-white border rounded shadow p-2">
						<div class="flex flex-row items-center">
							<div class="flex-shrink pr-4">
								<div class="rounded p-3 bg-yellow-600">
									<i class="fa fa-user-plus"></i>
								</div>
							</div>
							<div class="flex-1 text-right md:text-center">
								<h5 class="font-bold uppercase color-orange">
									Nombre de salons
								</h5>
								<h3 class="font-bold text-3xl">
									{{ rooms ? rooms.length : null }}
									<span class="text-yellow-600"
										><i class="fa fa-caret-up"></i
									></span>
								</h3>
							</div>
						</div>
					</div>
				</div>
			</div>
			<hr class="border-b-2 border-gray-400 my-8 mx-4" />
			<div class="flex flex-row flex-wrap flex-grow mt-2">
				<div class="w-full md:w-1/2 p-3">
					<div class="bg-white border rounded shadow">
						<div class="border-b p-3">
							<h5 class="font-bold uppercase color-orange">Utilisateurs</h5>
						</div>
						<div class="p-5">
							<table class="w-full p-5 text-gray-700">
								<thead>
									<tr>
										<th class="text-left">#</th>
										<th class="text-left">Nom</th>
										<th class="text-left">Adresse mail</th>
									</tr>
								</thead>
								<tbody>
									<tr v-for="(user, index) in users" :key="user.id">
										<td class="pt-2">{{ index === 0 ? 1 : index + 1 }}</td>
										<td class="pt-2">
											{{ user.firstName + " " + user.lastName }}
										</td>
										<td class="pt-2">{{ user.email }}</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				</div>
				<div class="w-full md:w-1/2 p-3">
					<RoomCard
						v-if="isEditing"
						:room="current_room"
						:addRoom="fetchAddRoom"
						:changeIsEditing="changeIsEditing"
						:editRoom="fetchUpdateRoom"
					/>
					<div v-else class="bg-white border rounded shadow">
						<div class="border-b p-3 flex justify-between">
							<div>
								<h5 class="font-bold uppercase color-orange">Salons</h5>
							</div>
							<div>
								<font-awesome-icon
									icon="circle-plus"
									style="cursor: pointer"
									@click="onClickAddRoom"
								/>
							</div>
						</div>
						<div class="p-5">
							<table class="w-full p-5 text-gray-700">
								<thead>
									<tr>
										<th class="text-left">#</th>
										<th class="text-left">Nom</th>
										<th class="text-left">Capacité</th>
										<th class="text-left">Membre</th>
									</tr>
								</thead>
								<tbody>
									<tr v-for="(room, index) in rooms" :key="room.id">
										<td class="pt-2">{{ index === 0 ? 1 : index + 1 }}</td>
										<td class="pt-2">{{ room.name }}</td>
										<td class="pt-2">{{ room.maxParticipants }}</td>
										<td class="pt-2">{{ room.participants.length }}</td>
										<td class="pt-2">
											<font-awesome-icon
												icon="pen-to-square"
												style="color: blue; cursor: pointer"
												@click="editRoom(room)"
											/>
											<font-awesome-icon
												icon="trash"
												style="
													color: #d71a1a;
													margin-left: 5px;
													cursor: pointer;
												"
												@click="fetchDeleteRoom(room.id)"
											/>
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				</div>
				<div class="w-full md:w-1/2 p-3">
					<div class="bg-white border rounded shadow">
						<div class="border-b p-3 flex justify-between">
							<div>
								<h5 class="font-bold uppercase color-orange">
									Demande de communication
								</h5>
							</div>
						</div>
						<div class="p-5">
							<table class="w-full p-5 text-gray-700">
								<thead>
									<tr>
										<th class="text-left">#</th>
										<th class="text-left">Utilisateur</th>
										<th class="text-left">Date</th>
										<th class="text-left">Message</th>
									</tr>
								</thead>
								<tbody>
									<tr
										v-for="(request, index) in requestsPending"
										:key="requestsPending.id"
									>
										<td class="pt-2">{{ index === 0 ? 1 : index + 1 }}</td>
										<td class="pt-2">{{ fullName(request.clientId) }}</td>
										<td class="pt-2">
											{{
												moment(request.createdAt).startOf("minute").fromNow()
											}}
										</td>
										<td class="pt-2">
											{{ request.message.substring(0, 30) }}...
										</td>
										<td class="pt-2">
											<font-awesome-icon
												icon="check"
												style="color: blue; cursor: pointer"
												@click="onClickAcceptRequest(request.id)"
											/>
											<font-awesome-icon
												icon="xmark"
												style="
													color: #d71a1a;
													margin-left: 5px;
													cursor: pointer;
												"
												@click="onClickRejectRequest(request.id)"
											/>
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				</div>
				<div class="w-full md:w-1/2 p-3">
					<div class="bg-white border rounded shadow">
						<div class="border-b p-3 flex justify-between">
							<div>
								<h5 class="font-bold uppercase color-orange">
									Créer une notification commerciale
								</h5>
							</div>
						</div>
						<div class="p-5">
							<NotificationForm />
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<style scoped>
.dashboard {
	margin: 40px 50px 20px 50px;
}

.dashboard .fa-google-wallet,
.dashboard .fa-users,
.dashboard .fa-user-plus {
	font-size: 30px;
	color: white;
}

.dashboard .toggle {
	cursor: pointer;
	display: inline-block;
}

.dashboard .toggle-switch {
	display: inline-block;
	background: #ccc;
	border-radius: 16px;
	width: 58px;
	height: 26px;
	position: relative;
	vertical-align: middle;
	transition: background 0.25s;
}

.dashboard .toggle-switch:before,
.dashboard .toggle-switch:after {
	content: "";
}

.dashboard .toggle-switch:before {
	display: block;
	background: linear-gradient(to bottom, #fff 0%, #eee 100%);
	border-radius: 50%;
	box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.25);
	width: 19px;
	height: 19px;
	position: absolute;
	top: 4px;
	left: 4px;
	transition: left 0.25s;
}

.dashboard .heading {
	padding-left: 7.5px;
}

@media (max-width: 767px) {
	.dashboard .heading {
		padding-left: 0;
		justify-content: center;
		margin-bottom: 12px;
	}

	.leading-normal {
		margin-bottom: 0;
	}
}

@media (max-width: 565px) {
	.dashboard {
		margin: 0;
	}
}

.dashboard .toggle:hover .toggle-switch:before {
	background: linear-gradient(to bottom, #fff 0%, #fff 100%);
	box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.5);
}

.dashboard .toggle-checkbox:checked + .toggle-switch {
	background: #f04c26;
}

.dashboard .toggle-checkbox:checked + .toggle-switch:before {
	left: 35px;
}

.pt-2 {
	padding-top: 10px;
}

.dashboard .color-orange {
	color: #f04c26;
}

.dashboard .toggle-checkbox {
	position: absolute;
	visibility: hidden;
}

.dashboard .toggle-label {
	margin-right: 5px;
	position: relative;
	top: 2px;
}
</style>
